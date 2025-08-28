import pytest
from tests.database import client, session
import schemas


@pytest.mark.parametrize("first_name, last_name, team_number, email, password",
                         [
                            ("Natester", "Taylor", 130, "BigNate@gmail.com", "password123"),
                            ("Jimmy", "Bones", 130, "MoBones@gmail.com", "password123"),
                            ("Lily", "Paddack", 130, "JustPaddy@gmail.com", "password123")
                         ])

def test_create_user(client, first_name, last_name, team_number, email, password):
    res = client.post("/users/", json={
        "first_name": first_name,
        "last_name": last_name,
        "team_number": team_number,
        "email": email,
        "password": password
    })

    schemas.UserDisplay(**res.json())
    assert res.json().get("team_number") == 130
    assert res.status_code == 201


