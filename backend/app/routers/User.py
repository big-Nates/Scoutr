from typing import List
from app import models, schemas, utils
from fastapi import Depends, FastAPI, HTTPException, status, Response, APIRouter
from sqlalchemy.orm import Session
from ..database import engine,get_db
import requests

router = APIRouter(
    prefix = "/users",
    tags=["Users"]
)

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UserDisplay)
def create_user(new_user: schemas.UserCreate, db: Session = Depends(get_db)):

    # hash the password
    hashed_password = utils.hash(new_user.password)
    new_user.password = hashed_password

    team_number = new_user.team_number
    url = "https://api.ftcscout.org/rest/v1/teams/"+str(team_number)

    queried_user = db.query(models.User).filter(new_user.email == models.User.email).first()
    response = requests.get(url)
    queried_user2 = db.query(models.User).filter(models.User.team_number == new_user.team_number).all()

    if queried_user:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The same user cannot be made twice"
            )
    elif response.status_code == 404:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Team #{team_number} not found."
        )
    
    if not queried_user2:
        created_user = models.User(role = "team_admin", **new_user.model_dump())
    else:
        created_user = models.User(role = "member", **new_user.model_dump())
    db.add(created_user)
    db.commit()
    db.refresh(created_user)
    return created_user

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.UserDisplay])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

@router.get("/{user_id}", response_model=schemas.UserDisplay)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User._id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return user



