from decimal import Decimal


def test_create_and_get_goal(client):
    body = {
        "title": "Python マスター",
        "description": "Python基礎を100時間学習",
        "target_hours": 100,
        "subject": "Python",
    }
    resp = client.post("/api/v1/goals/", json=body)
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "Python マスター"
    assert data["target_hours"] == 100
    assert data["status"] == "active"
    goal_id = data["goal_id"]

    resp = client.get(f"/api/v1/goals/{goal_id}")
    assert resp.status_code == 200
    assert resp.json()["goal_id"] == goal_id


def test_list_goals(client):
    for i in range(3):
        client.post("/api/v1/goals/", json={
            "title": f"目標{i}",
            "target_hours": 10 * (i + 1),
        })

    resp = client.get("/api/v1/goals/")
    assert resp.status_code == 200
    assert len(resp.json()) == 3


def test_update_goal(client):
    resp = client.post("/api/v1/goals/", json={
        "title": "初期タイトル",
        "target_hours": 50,
    })
    goal_id = resp.json()["goal_id"]

    resp = client.put(f"/api/v1/goals/{goal_id}", json={
        "title": "更新タイトル",
        "status": "paused",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["title"] == "更新タイトル"
    assert data["status"] == "paused"


def test_delete_goal(client):
    resp = client.post("/api/v1/goals/", json={
        "title": "削除する目標",
        "target_hours": 10,
    })
    goal_id = resp.json()["goal_id"]

    resp = client.delete(f"/api/v1/goals/{goal_id}")
    assert resp.status_code == 204

    resp = client.get(f"/api/v1/goals/{goal_id}")
    assert resp.status_code == 404


def test_goal_progress(client, dynamodb_mock):
    # 目標を作成
    resp = client.post("/api/v1/goals/", json={
        "title": "Python 50時間",
        "target_hours": 50,
        "subject": "Python",
    })
    goal_id = resp.json()["goal_id"]

    # records テーブルに直接 put_item（records API は別サービスのため）
    records_table = dynamodb_mock.Table("study-tracker-records")
    records_table.put_item(Item={
        "user_id": "default-user",
        "record_id": "rec-001",
        "study_date": "2025-01-15",
        "subject": "Python",
        "duration_minutes": 120,
        "goal_id": goal_id,
        "created_at": "2025-01-15T00:00:00+00:00",
        "updated_at": "2025-01-15T00:00:00+00:00",
    })
    records_table.put_item(Item={
        "user_id": "default-user",
        "record_id": "rec-002",
        "study_date": "2025-01-16",
        "subject": "Python",
        "duration_minutes": 60,
        "goal_id": goal_id,
        "created_at": "2025-01-16T00:00:00+00:00",
        "updated_at": "2025-01-16T00:00:00+00:00",
    })

    resp = client.get(f"/api/v1/goals/{goal_id}/progress")
    assert resp.status_code == 200
    data = resp.json()
    assert data["current_hours"] == 3.0
    assert data["records_count"] == 2
    assert data["progress_percent"] == 6.0
    assert data["remaining_hours"] == 47.0


def test_get_nonexistent_goal(client):
    resp = client.get("/api/v1/goals/nonexistent")
    assert resp.status_code == 404


def test_filter_goals_by_status(client):
    resp1 = client.post("/api/v1/goals/", json={
        "title": "アクティブ目標",
        "target_hours": 10,
    })
    resp2 = client.post("/api/v1/goals/", json={
        "title": "完了目標",
        "target_hours": 5,
    })
    goal_id2 = resp2.json()["goal_id"]
    client.put(f"/api/v1/goals/{goal_id2}", json={"status": "completed"})

    resp = client.get("/api/v1/goals/?status=active")
    assert resp.status_code == 200
    goals = resp.json()
    assert len(goals) == 1
    assert goals[0]["title"] == "アクティブ目標"
