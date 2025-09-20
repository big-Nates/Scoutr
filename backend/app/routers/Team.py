from typing import List, Optional
from app import models, schemas, oauth2
from fastapi import Depends, FastAPI, HTTPException, status, Response, APIRouter
from sqlalchemy.orm import Session
from ..database import engine,get_db
import requests

router = APIRouter(
    prefix = "/teams",
    tags=["Teams"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.TeamDisplay)
# user: schemas.UserDisplay = Depends(oauth2.get_current_user)
def create_team(team_data: schemas.TeamCreate, db: Session = Depends(get_db)):
    # if user.role != "team_admin":
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
    #                         detail="User does not have the permissions to make a team")
    team_number = team_data.number
    url = f"https://api.ftcscout.org/rest/v1/teams/" + str(team_number)
    response = requests.get(url)
    data = response.json()

    if response.status_code != 200 or data["name"] != team_data.name:
        raise HTTPException(status_code=response.status_code, detail="Team not found")

    team = models.Team(**team_data.model_dump())
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.TeamDisplay])
def get_all_teams(db: Session = Depends(get_db)):
    teams = db.query(models.Team).all()
    return teams

@router.get("/{team_number}", status_code=status.HTTP_200_OK, response_model=schemas.TeamDisplay)
def get_team(team_number: int, db: Session = Depends(get_db)):
    team = db.query(models.Team).filter(models.Team.number == team_number).first()
    return team

@router.get("/{team_number}/users", response_model=List[schemas.UserDisplay])
def get_user(team_number: int, db: Session = Depends(get_db)):
    users = db.query(models.User).filter(models.User.team_number == team_number).all()
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team number #{team_number} not found"
        )
    return users