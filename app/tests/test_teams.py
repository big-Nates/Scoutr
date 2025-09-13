from app import schemas
from .database import client, session
import pytest

@pytest.fixture
def test_fixture_create_team(client):
    res = client.post("/teams/", json={"name": "Blazing Spirits", "number": "130"})
    team = res.json()
    team_schema = schemas.TeamDisplay(**team)

    assert res.status_code == 201
    assert team_schema.name == "Blazing Spirits"

    return team

def test_create_team(client):
    res = client.post("/teams/", json={"name": "FullMetal Phoenixes", "number": "18813"})

    new_team = schemas.TeamDisplay(**res.json())
    assert res.status_code == 201
    assert new_team.name == "FullMetal Phoenixes"

def test_get_team(client, test_fixture_create_team):
    res = client.get("/teams/130/")
    team = schemas.TeamDisplay(**res.json())

    assert res.status_code == 200
    assert team.number == 130
    assert team.name == "Blazing Spirits"



