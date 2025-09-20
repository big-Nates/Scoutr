import pytest
from app import schemas
from .database import client, session
from jose import JWTError, jwt # pyright: ignore[reportMissingModuleSource]
from app.config import settings
from ..oauth2 import create_access_token
from .test_users import test_fixture_create_user
from .test_teams import test_fixture_create_team


@pytest.fixture
def test_token():
    # Simulate a "user id" or any claim you normally store
    data = {"user_id": 1, "user_email": "BigNate@gmail.com"}
    return create_access_token(data)

@pytest.fixture
def auth_header(test_token):
    return {"Authorization": f"Bearer {test_token}"}

@pytest.fixture
def sample_match_reports(client, auth_header, test_fixture_create_user, test_fixture_create_team):
    match_report_data = {
        "is_public": False,

        "team_number": 130,
        "match_number": 10,
        "tournament_level": "Quals",

        "classified_amount_auto": 5,
        "overflow_amount_auto": 5,
        "can_collect_from_human_player": True,
        "can_deposit_close": False,
        "can_deposit_far": True,
        "can_leave": False,
        "can_motif_in_auto": True,

        "classified_amount": 15,
        "depot_amount": 2,
        "can_endgame_park": False,
        "ascent_level": 2,

        "additional_info": "No additional info about the team"
    }
    
    res = client.post("/match_reports/2024/USCTCMP", json=match_report_data, headers=auth_header)
    report = schemas.MatchReportDisplay(**res.json())

    assert res.status_code == 201
    assert report.team_number == match_report_data["team_number"]
    assert report.match_number == match_report_data["match_number"]
    assert report.overflow_amount_auto == match_report_data["overflow_amount_auto"]
    assert report.classified_amount == match_report_data["classified_amount"]
    assert report.classified_amount_auto == match_report_data["classified_amount_auto"]

    return report

def test_get_match_report(client, auth_header, sample_match_reports):
    res = client.get("/match_reports/id/1/", headers=auth_header)
    match_report = schemas.MatchReportDisplay(**res.json())

    assert res.status_code == 200
    assert match_report.team_number == 130
    assert match_report.match_number == 10
    assert match_report.overflow_amount_auto == 5
    assert match_report.classified_amount == 15
    assert match_report.classified_amount_auto == 5
    
