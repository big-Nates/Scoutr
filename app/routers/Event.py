import requests, json
from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from ..oauth2 import get_current_user
from app import models, schemas, oauth2
from datetime import date


router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

@router.post("/", status_code=status.HTTP_201_CREATED,response_model=schemas.EventDisplay)
def create_event(event: schemas.EventAdd,db:Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    url = f"https://api.ftcscout.org/rest/v1/events/" + str(event.season) + "/" + event.code
    response = requests.get(url)
    queried_event = db.query(models.Event).filter(models.Event.code == response.json()["code"], 
                                                  models.Event.season == response.json()["season"]).first()
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Team not found")
    if queried_event:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Event Already exists in database")
    
    created_event = response.json()
    created_event["start"] = date.fromisoformat(created_event["start"])
    event_info = schemas.EventCreate(**created_event)
    new_event = models.Event(**event_info.model_dump())
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.EventDisplay])
def get_all_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    return events

@router.get("/{season}/{event_code}", response_model=schemas.EventDisplay)
def get_event(event_code: str, season: int, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.code == event_code, 
                                         models.Event.season == season).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Event with code {event_code} in the {season}-{season+1} season not found"
        )
    return event




