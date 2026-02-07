def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_create_and_get_record(client):
    body = {
        "study_date": "2025-01-15",
        "subject": "Python",
        "duration_minutes": 60,
        "memo": "FastAPI学習",
    }
    resp = client.post("/api/v1/records/", json=body)
    assert resp.status_code == 201
    data = resp.json()
    assert data["subject"] == "Python"
    assert data["duration_minutes"] == 60
    record_id = data["record_id"]

    resp = client.get(f"/api/v1/records/{record_id}")
    assert resp.status_code == 200
    assert resp.json()["record_id"] == record_id


def test_list_records(client):
    for i in range(3):
        client.post("/api/v1/records/", json={
            "study_date": f"2025-01-{15 + i:02d}",
            "subject": "Python",
            "duration_minutes": 30 + i * 10,
        })

    resp = client.get("/api/v1/records/")
    assert resp.status_code == 200
    assert len(resp.json()) == 3


def test_list_records_with_date_filter(client):
    client.post("/api/v1/records/", json={
        "study_date": "2025-01-10",
        "subject": "Python",
        "duration_minutes": 30,
    })
    client.post("/api/v1/records/", json={
        "study_date": "2025-01-20",
        "subject": "Python",
        "duration_minutes": 60,
    })

    resp = client.get("/api/v1/records/?date_from=2025-01-15&date_to=2025-01-31")
    assert resp.status_code == 200
    records = resp.json()
    assert len(records) == 1
    assert records[0]["study_date"] == "2025-01-20"


def test_update_record(client):
    resp = client.post("/api/v1/records/", json={
        "study_date": "2025-01-15",
        "subject": "Python",
        "duration_minutes": 60,
    })
    record_id = resp.json()["record_id"]

    resp = client.put(f"/api/v1/records/{record_id}", json={
        "subject": "TypeScript",
        "duration_minutes": 90,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["subject"] == "TypeScript"
    assert data["duration_minutes"] == 90


def test_delete_record(client):
    resp = client.post("/api/v1/records/", json={
        "study_date": "2025-01-15",
        "subject": "Python",
        "duration_minutes": 60,
    })
    record_id = resp.json()["record_id"]

    resp = client.delete(f"/api/v1/records/{record_id}")
    assert resp.status_code == 204

    resp = client.get(f"/api/v1/records/{record_id}")
    assert resp.status_code == 404


def test_get_nonexistent_record(client):
    resp = client.get("/api/v1/records/nonexistent")
    assert resp.status_code == 404


def test_stats_summary(client):
    client.post("/api/v1/records/", json={
        "study_date": "2025-01-15",
        "subject": "Python",
        "duration_minutes": 60,
    })
    client.post("/api/v1/records/", json={
        "study_date": "2025-01-16",
        "subject": "TypeScript",
        "duration_minutes": 90,
    })

    resp = client.get("/api/v1/records/stats/summary?date_from=2025-01-01&date_to=2025-01-31")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_minutes"] == 150
    assert data["total_records"] == 2
    assert data["study_days"] == 2
    assert data["subjects"]["Python"] == 60
    assert data["subjects"]["TypeScript"] == 90


def test_calendar_data(client):
    client.post("/api/v1/records/", json={
        "study_date": "2025-01-15",
        "subject": "Python",
        "duration_minutes": 60,
    })
    client.post("/api/v1/records/", json={
        "study_date": "2025-01-15",
        "subject": "TypeScript",
        "duration_minutes": 30,
    })

    resp = client.get("/api/v1/records/stats/calendar?year=2025&month=1")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["date"] == "2025-01-15"
    assert data[0]["total_minutes"] == 90
    assert data[0]["record_count"] == 2
