from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app
)

def test_get_teams():
    response = client.get("/teams")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["number"] == 130