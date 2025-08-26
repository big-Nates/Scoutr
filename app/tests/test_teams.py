from fastapi.testclient import TestClient
from app.main import app
from app import schemas

client = TestClient(app)

def test_root():
    res = client.get("/")
    assert res.json().get("message") == "Hello"
    assert res.status_code == 200

def test_create_team():
    res = client.post("/teams/", json={"name": "FullMetal Phoenixes", "number": "18813"})

    new_team = schemas.TeamDisplay(**res.json())
    assert res.status_code == 201
    assert new_team.name == "FullMetal Phoenixes"