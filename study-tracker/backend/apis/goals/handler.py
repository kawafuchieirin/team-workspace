import uuid
from datetime import date, datetime, UTC
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------


class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(default="", max_length=1000)
    target_hours: float = Field(..., gt=0)
    target_date: date | None = None
    subject: str = Field(default="", max_length=100)


class GoalUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    target_hours: float | None = Field(default=None, gt=0)
    status: str | None = Field(default=None, pattern="^(active|completed|paused|abandoned)$")
    target_date: date | None = None
    subject: str | None = Field(default=None, max_length=100)


class GoalResponse(BaseModel):
    goal_id: str
    user_id: str
    title: str
    description: str = ""
    target_hours: float
    current_hours: float = 0.0
    status: str = "active"
    target_date: str | None = None
    subject: str = ""
    created_at: str
    updated_at: str


class GoalProgress(BaseModel):
    goal_id: str
    title: str
    target_hours: float
    current_hours: float
    progress_percent: float
    remaining_hours: float
    status: str
    records_count: int


# ---------------------------------------------------------------------------
# DynamoDB helpers
# ---------------------------------------------------------------------------


def _get_settings():
    from main import settings
    return settings


def _get_dynamodb_resource():
    s = _get_settings()
    kwargs = {
        "region_name": s.dynamodb_region,
        "aws_access_key_id": s.aws_access_key_id,
        "aws_secret_access_key": s.aws_secret_access_key,
    }
    if s.dynamodb_endpoint:
        kwargs["endpoint_url"] = s.dynamodb_endpoint
    return boto3.resource("dynamodb", **kwargs)


def _get_goals_table():
    return _get_dynamodb_resource().Table(_get_settings().goals_table_name)


def _get_records_table():
    return _get_dynamodb_resource().Table(_get_settings().records_table_name)


# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------


def get_user_id() -> str:
    return _get_settings().default_user_id


# ---------------------------------------------------------------------------
# Business logic
# ---------------------------------------------------------------------------


def _serialize_goal(item: dict) -> dict:
    result = dict(item)
    for key, value in result.items():
        if isinstance(value, Decimal):
            result[key] = float(value)
    return result


def create_goal(user_id: str, data: dict) -> dict:
    table = _get_goals_table()
    now = datetime.now(UTC).isoformat()
    goal_id = str(uuid.uuid4())

    item = {
        "user_id": user_id,
        "goal_id": goal_id,
        "title": data["title"],
        "description": data.get("description", ""),
        "target_hours": Decimal(str(data["target_hours"])),
        "current_hours": Decimal("0"),
        "status": "active",
        "subject": data.get("subject", ""),
        "created_at": now,
        "updated_at": now,
    }
    if data.get("target_date"):
        item["target_date"] = str(data["target_date"])

    table.put_item(Item=item)
    return _serialize_goal(item)


def get_goal(user_id: str, goal_id: str) -> dict | None:
    table = _get_goals_table()
    resp = table.get_item(Key={"user_id": user_id, "goal_id": goal_id})
    item = resp.get("Item")
    return _serialize_goal(item) if item else None


def list_goals(user_id: str, status: str | None = None) -> list[dict]:
    table = _get_goals_table()

    if status:
        resp = table.query(
            IndexName="status-index",
            KeyConditionExpression=Key("user_id").eq(user_id) & Key("status").eq(status),
        )
    else:
        resp = table.query(KeyConditionExpression=Key("user_id").eq(user_id))

    items = [_serialize_goal(i) for i in resp.get("Items", [])]
    items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return items


def update_goal(user_id: str, goal_id: str, data: dict) -> dict | None:
    existing = get_goal(user_id, goal_id)
    if not existing:
        return None

    table = _get_goals_table()
    update_fields = {k: v for k, v in data.items() if v is not None}
    if not update_fields:
        return existing

    update_fields["updated_at"] = datetime.now(UTC).isoformat()

    for key, value in update_fields.items():
        if hasattr(value, "isoformat"):
            update_fields[key] = str(value)
        if key in ("target_hours", "current_hours") and not isinstance(value, Decimal):
            update_fields[key] = Decimal(str(value))

    update_expr_parts = []
    expr_values = {}
    expr_names = {}

    for i, (key, value) in enumerate(update_fields.items()):
        placeholder_name = f"#f{i}"
        placeholder_value = f":v{i}"
        update_expr_parts.append(f"{placeholder_name} = {placeholder_value}")
        expr_names[placeholder_name] = key
        expr_values[placeholder_value] = value

    table.update_item(
        Key={"user_id": user_id, "goal_id": goal_id},
        UpdateExpression="SET " + ", ".join(update_expr_parts),
        ExpressionAttributeNames=expr_names,
        ExpressionAttributeValues=expr_values,
    )

    return get_goal(user_id, goal_id)


def delete_goal(user_id: str, goal_id: str) -> bool:
    existing = get_goal(user_id, goal_id)
    if not existing:
        return False

    table = _get_goals_table()
    table.delete_item(Key={"user_id": user_id, "goal_id": goal_id})
    return True


def recalculate_current_hours(user_id: str, goal_id: str) -> dict | None:
    """目標に紐づく学習記録から現在の学習時間を再計算"""
    goal = get_goal(user_id, goal_id)
    if not goal:
        return None

    records_table = _get_records_table()
    resp = records_table.query(KeyConditionExpression=Key("user_id").eq(user_id))
    records = resp.get("Items", [])

    total_minutes = sum(
        int(r["duration_minutes"])
        for r in records
        if r.get("goal_id") == goal_id
    )
    current_hours = round(total_minutes / 60, 2)

    return update_goal(user_id, goal_id, {"current_hours": current_hours})


def get_goal_progress(user_id: str, goal_id: str) -> dict | None:
    goal = recalculate_current_hours(user_id, goal_id)
    if not goal:
        return None

    target = goal["target_hours"]
    current = goal["current_hours"]
    progress = min(round((current / target) * 100, 1), 100.0) if target > 0 else 0.0
    remaining = max(target - current, 0)

    records_table = _get_records_table()
    resp = records_table.query(KeyConditionExpression=Key("user_id").eq(user_id))
    records_count = sum(1 for r in resp.get("Items", []) if r.get("goal_id") == goal_id)

    return {
        "goal_id": goal_id,
        "title": goal["title"],
        "target_hours": target,
        "current_hours": current,
        "progress_percent": progress,
        "remaining_hours": round(remaining, 2),
        "status": goal["status"],
        "records_count": records_count,
    }


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

router = APIRouter()


@router.get("/", response_model=list[GoalResponse])
def route_list_goals(
    status: str | None = Query(None),
    user_id: str = Depends(get_user_id),
):
    return list_goals(user_id, status=status)


@router.post("/", response_model=GoalResponse, status_code=201)
def route_create_goal(
    body: GoalCreate,
    user_id: str = Depends(get_user_id),
):
    return create_goal(user_id, body.model_dump())


@router.get("/{goal_id}", response_model=GoalResponse)
def route_get_goal(
    goal_id: str,
    user_id: str = Depends(get_user_id),
):
    goal = get_goal(user_id, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="目標が見つかりません")
    return goal


@router.get("/{goal_id}/progress", response_model=GoalProgress)
def route_get_goal_progress(
    goal_id: str,
    user_id: str = Depends(get_user_id),
):
    progress = get_goal_progress(user_id, goal_id)
    if not progress:
        raise HTTPException(status_code=404, detail="目標が見つかりません")
    return progress


@router.put("/{goal_id}", response_model=GoalResponse)
def route_update_goal(
    goal_id: str,
    body: GoalUpdate,
    user_id: str = Depends(get_user_id),
):
    goal = update_goal(user_id, goal_id, body.model_dump(exclude_unset=True))
    if not goal:
        raise HTTPException(status_code=404, detail="目標が見つかりません")
    return goal


@router.delete("/{goal_id}", status_code=204)
def route_delete_goal(
    goal_id: str,
    user_id: str = Depends(get_user_id),
):
    if not delete_goal(user_id, goal_id):
        raise HTTPException(status_code=404, detail="目標が見つかりません")
