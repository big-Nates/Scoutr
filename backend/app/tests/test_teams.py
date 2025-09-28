from backend.app import schemas
from .database import client, session
import pytest

@pytest.fixture
def test_fixture_create_team(client):
    res = client.post("/teams/", json={"name": "Blazing Spirits", "number": "130"})
    team_schema = schemas.TeamDisplay(**res.json())

    assert res.status_code == 201
    assert team_schema.name == "Blazing Spirits"

    return team_schema

def test_create_team(test_fixture_create_team):
    pass

def test_get_team(client, test_fixture_create_team):
    res = client.get("/teams/130/")
    team = schemas.TeamDisplay(**res.json())

    assert res.status_code == 200
    assert team.number == 130
    assert team.name == "Blazing Spirits"



