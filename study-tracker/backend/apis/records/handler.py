import uuid
from datetime import date, time, datetime, UTC
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------


class StudyRecordCreate(BaseModel):
    study_date: date
    subject: str = Field(..., min_length=1, max_length=100)
    duration_minutes: int = Field(..., gt=0, le=1440)
    start_time: time | None = None
    end_time: time | None = None
    memo: str = Field(default="", max_length=1000)
    goal_id: str | None = None


class StudyRecordUpdate(BaseModel):
    study_date: date | None = None
    subject: str | None = Field(default=None, min_length=1, max_length=100)
    duration_minutes: int | None = Field(default=None, gt=0, le=1440)
    start_time: time | None = None
    end_time: time | None = None
    memo: str | None = Field(default=None, max_length=1000)
    goal_id: str | None = None


class StudyRecordResponse(BaseModel):
    record_id: str
    user_id: str
    study_date: str
    subject: str
    duration_minutes: int
    start_time: str | None = None
    end_time: str | None = None
    memo: str = ""
    goal_id: str | None = None
    created_at: str
    updated_at: str


class StudyStatsSummary(BaseModel):
    total_minutes: int
    total_records: int
    subjects: dict[str, int]
    daily_average_minutes: float
    study_days: int


class CalendarDay(BaseModel):
    date: str
    total_minutes: int
    record_count: int
    subjects: list[str]


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


def _serialize_record(item: dict) -> dict:
    result = dict(item)
    for key, value in result.items():
        if isinstance(value, Decimal):
            result[key] = int(value)
    return result


def create_record(user_id: str, data: dict) -> dict:
    table = _get_records_table()
    now = datetime.now(UTC).isoformat()
    record_id = str(uuid.uuid4())

    item = {
        "user_id": user_id,
        "record_id": record_id,
        "study_date": str(data["study_date"]),
        "subject": data["subject"],
        "duration_minutes": data["duration_minutes"],
        "memo": data.get("memo", ""),
        "goal_id": data.get("goal_id"),
        "created_at": now,
        "updated_at": now,
    }
    if data.get("start_time"):
        item["start_time"] = str(data["start_time"])
    if data.get("end_time"):
        item["end_time"] = str(data["end_time"])

    item = {k: v for k, v in item.items() if v is not None}
    table.put_item(Item=item)
    return _serialize_record(item)


def get_record(user_id: str, record_id: str) -> dict | None:
    table = _get_records_table()
    resp = table.get_item(Key={"user_id": user_id, "record_id": record_id})
    item = resp.get("Item")
    return _serialize_record(item) if item else None


def list_records(
    user_id: str,
    date_from: date | None = None,
    date_to: date | None = None,
    subject: str | None = None,
) -> list[dict]:
    table = _get_records_table()

    if date_from or date_to:
        key_condition = Key("user_id").eq(user_id)
        if date_from and date_to:
            key_condition &= Key("study_date").between(str(date_from), str(date_to))
        elif date_from:
            key_condition &= Key("study_date").gte(str(date_from))
        else:
            key_condition &= Key("study_date").lte(str(date_to))

        resp = table.query(IndexName="date-index", KeyConditionExpression=key_condition)
    else:
        resp = table.query(KeyConditionExpression=Key("user_id").eq(user_id))

    items = [_serialize_record(i) for i in resp.get("Items", [])]

    if subject:
        items = [i for i in items if i.get("subject") == subject]

    items.sort(key=lambda x: x.get("study_date", ""), reverse=True)
    return items


def update_record(user_id: str, record_id: str, data: dict) -> dict | None:
    existing = get_record(user_id, record_id)
    if not existing:
        return None

    table = _get_records_table()
    update_fields = {k: v for k, v in data.items() if v is not None}
    if not update_fields:
        return existing

    update_fields["updated_at"] = datetime.now(UTC).isoformat()

    for key, value in update_fields.items():
        if hasattr(value, "isoformat"):
            update_fields[key] = str(value)

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
        Key={"user_id": user_id, "record_id": record_id},
        UpdateExpression="SET " + ", ".join(update_expr_parts),
        ExpressionAttributeNames=expr_names,
        ExpressionAttributeValues=expr_values,
    )

    return get_record(user_id, record_id)


def delete_record(user_id: str, record_id: str) -> bool:
    existing = get_record(user_id, record_id)
    if not existing:
        return False

    table = _get_records_table()
    table.delete_item(Key={"user_id": user_id, "record_id": record_id})
    return True


def get_stats_summary(user_id: str, date_from: date, date_to: date) -> dict:
    records = list_records(user_id, date_from=date_from, date_to=date_to)

    total_minutes = sum(r["duration_minutes"] for r in records)
    subjects: dict[str, int] = {}
    study_dates: set[str] = set()

    for r in records:
        subjects[r["subject"]] = subjects.get(r["subject"], 0) + r["duration_minutes"]
        study_dates.add(r["study_date"])

    days_in_range = (date_to - date_from).days + 1
    daily_average = total_minutes / days_in_range if days_in_range > 0 else 0

    return {
        "total_minutes": total_minutes,
        "total_records": len(records),
        "subjects": subjects,
        "daily_average_minutes": round(daily_average, 1),
        "study_days": len(study_dates),
    }


def get_calendar_data(user_id: str, year: int, month: int) -> list[dict]:
    date_from = date(year, month, 1)
    if month == 12:
        date_to = date(year + 1, 1, 1)
    else:
        date_to = date(year, month + 1, 1)

    records = list_records(user_id, date_from=date_from, date_to=date_to)

    day_map: dict[str, dict] = {}
    for r in records:
        d = r["study_date"]
        if d not in day_map:
            day_map[d] = {"date": d, "total_minutes": 0, "record_count": 0, "subjects": set()}
        day_map[d]["total_minutes"] += r["duration_minutes"]
        day_map[d]["record_count"] += 1
        day_map[d]["subjects"].add(r["subject"])

    result = []
    for day_data in sorted(day_map.values(), key=lambda x: x["date"]):
        day_data["subjects"] = sorted(day_data["subjects"])
        result.append(day_data)

    return result


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

router = APIRouter()


@router.get("/", response_model=list[StudyRecordResponse])
def route_list_records(
    date_from: date | None = Query(None),
    date_to: date | None = Query(None),
    subject: str | None = Query(None),
    user_id: str = Depends(get_user_id),
):
    return list_records(user_id, date_from=date_from, date_to=date_to, subject=subject)


@router.post("/", response_model=StudyRecordResponse, status_code=201)
def route_create_record(
    body: StudyRecordCreate,
    user_id: str = Depends(get_user_id),
):
    return create_record(user_id, body.model_dump())


@router.get("/stats/summary", response_model=StudyStatsSummary)
def route_get_stats_summary(
    date_from: date = Query(...),
    date_to: date = Query(...),
    user_id: str = Depends(get_user_id),
):
    return get_stats_summary(user_id, date_from, date_to)


@router.get("/stats/calendar", response_model=list[CalendarDay])
def route_get_calendar_data(
    year: int = Query(...),
    month: int = Query(..., ge=1, le=12),
    user_id: str = Depends(get_user_id),
):
    return get_calendar_data(user_id, year, month)


@router.get("/{record_id}", response_model=StudyRecordResponse)
def route_get_record(
    record_id: str,
    user_id: str = Depends(get_user_id),
):
    record = get_record(user_id, record_id)
    if not record:
        raise HTTPException(status_code=404, detail="学習記録が見つかりません")
    return record


@router.put("/{record_id}", response_model=StudyRecordResponse)
def route_update_record(
    record_id: str,
    body: StudyRecordUpdate,
    user_id: str = Depends(get_user_id),
):
    record = update_record(user_id, record_id, body.model_dump(exclude_unset=True))
    if not record:
        raise HTTPException(status_code=404, detail="学習記録が見つかりません")
    return record


@router.delete("/{record_id}", status_code=204)
def route_delete_record(
    record_id: str,
    user_id: str = Depends(get_user_id),
):
    if not delete_record(user_id, record_id):
        raise HTTPException(status_code=404, detail="学習記録が見つかりません")
