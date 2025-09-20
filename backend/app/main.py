from fastapi import FastAPI
from app import models
from .database import engine
from .routers import SelfReport, MatchReport, Match, Team, User, auth
from .config import settings
from fastapi.middleware.cors import CORSMiddleware
from requests.auth import HTTPBasicAuth
import requests, json
from .config import settings

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


origins = [
    "https://google.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(User.router)
app.include_router(auth.router)
app.include_router(Team.router)
app.include_router(SelfReport.router)
app.include_router(MatchReport.router)
app.include_router(Match.router)

@app.get("/")
def root():
    url = f"http://ftc-api.firstinspires.org/v2.0/2024/teams?state=Ontario"
    response = requests.get(url, auth=HTTPBasicAuth(settings.api_username, settings.api_authtoken))
    return {"message": "Response",
            "details": response.json()}

