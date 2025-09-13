import pytest
from app import schemas
from .database import client, session
from jose import JWTError, jwt # pyright: ignore[reportMissingModuleSource]
from app.config import settings





@pytest.fixture
def test_fixture_create_user(client):
    user_data = {"first_name": "Big",
                "last_name_initial": "N",
                "team_number": 130,
                "email":"BigNate@gmail.com",
                "password": "password123"}
    res = client.post("/users/", json=user_data)

    assert res.status_code == 201
    new_user = res.json()
    new_user['password'] = user_data['password']
    return new_user

def test_create_user(test_fixture_create_user):
    pass

def test_login_user(client, test_fixture_create_user):
    res = client.post("/login/", data={
        "username": "BigNate@gmail.com",
        "password": "password123"
    })
    login_res = schemas.Token(**res.json())
    payload = jwt.decode(login_res.access_token, settings.secret_key, algorithms=[settings.algorithm])
    id = payload.get("user_id")
    assert res.status_code == 200
    assert login_res.token_type == 'bearer'

# @pytest.mark.parametrize("x, y, expected",[
#     (1, 4, 5),
#     (10, -5, 5),
#     (2, 5, 7)
# ])