from fastapi import FastAPI
from app import models
from .database import engine
from .routers import SelfReport, MatchReport, Match, Team, User, Event, auth
import requests
from .config import settings
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

#testing
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
app.include_router(Event.router)
app.include_router(SelfReport.router)
app.include_router(MatchReport.router)
app.include_router(Match.router)

@app.get("/")
def root():
    team_number = 130
    
    url = f"https://api.ftcscout.org/rest/v1/teams/130/events/2025"
    print(url)

    response = requests.get(url)

    if response.status_code == 200:
        team_data = response.json()
        print(team_data)
    else:
        print(f"Error {response.status_code}: {response.text}")


