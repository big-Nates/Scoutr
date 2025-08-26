from fastapi import FastAPI
from app import models
from .database import engine
from .routers import SelfReport, MatchReport, Match, Team, User, Event, auth
import requests
from .config import settings
from fastapi.middleware.cors import CORSMiddleware

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
app.include_router(Event.router)
app.include_router(SelfReport.router)
app.include_router(MatchReport.router)
app.include_router(Match.router)

@app.get("/")
def root():
    return {"message": "Hello",
            "details": "By me"}

