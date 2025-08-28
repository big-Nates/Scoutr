from app import schemas
from .database import client, session


def test_root(client):
    res = client.get("/")
    assert res.json().get("message") == "Hello"
    assert res.status_code == 200

def test_create_team(client):
    res = client.post("/teams/", json={"name": "FullMetal Phoenixes", "number": "18813"})

    new_team = schemas.TeamDisplay(**res.json())
    assert res.status_code == 201
    assert new_team.name == "FullMetal Phoenixes"




