from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from ..oauth2 import get_current_user
from app import models, schemas, oauth2
import requests, json
from requests.auth import HTTPBasicAuth
from ..config import settings


router = APIRouter(
    prefix="/match_reports",
    tags=["Match Reports"]
)

 
@router.post("/{season}/{event_code}")
def create_match_report(season:int, event_code: str, match_report_data: schemas.MatchReportCreate,db:Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):

    #verification of match's existence & the team's participation in the match
    url = f"https://api.ftcscout.org/rest/v1/events/{season}/{event_code}/matches"
    response = requests.get(url, auth=HTTPBasicAuth(settings.api_username, settings.api_authtoken))
    if response.status_code == 404:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Event with code {event_code} in the {season}-{season+1} season not found."
        ) 
    matches = response.json()
    matches_list = []
    if match_report_data.tournament_level not in ["Quals", "DoubleElim", "Finals"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Tournament Level doesn't exist"
        )
    for match in matches:
        if match["tournamentLevel"] == match_report_data.tournament_level:
            matches_list.append(match)

    if match_report_data.match_number > len(matches_list) or match_report_data.match_number <= 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Match doesn't exist"
        )
    
    sorted_match_list = sorted(matches_list, key=lambda x: x["id"])
    for team in sorted_match_list[match_report_data.match_number-1]["teams"]:
        if team["teamNumber"] == match_report_data.team_number:
            break
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Team #{match_report_data.team_number} was not in {match_report_data.tournament_level} #{match_report_data.match_number}"
        )
    
    #Check to see if report was already created
    queried_report = db.query(models.MatchReport).filter(models.MatchReport.user_id == current_user._id, 
                                                         models.MatchReport.team_number == match_report_data.team_number, 
                                                         models.MatchReport.match_number == match_report_data.match_number,
                                                         #TODO: Come back to this
                                                         models.MatchReport.event_code == "event_code" 
                                                         ).first()
    if queried_report:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Report for team {match_report_data.team_number} was already made by {current_user.first_name} {current_user.last_name_initial}."
        )
    
    
    print(match_report_data)
    created_match_report = models.MatchReport(event_id = -1, creator_id = current_user._id, season = season, **match_report_data.model_dump())
    db.add(created_match_report)
    db.commit()
    db.refresh(created_match_report)

    return created_match_report

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[schemas.MatchReportDisplay])
def get_all_teams_match_reports(db: Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(get_current_user)):
    match_reports = db.query(models.MatchReport).filter(models.MatchReport.team_number == current_user.team_number).all()
    return match_reports

@router.get("/{user_id}", response_model=List[schemas.MatchReportDisplay])
def get_users_match_reports(user_id: int, db: Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User._id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    if current_user.team_number == db.query(models.User).filter(models.User._id == user_id).first().team_number:
        match_reports = db.query(models.MatchReport).filter(models.MatchReport.user_id == user_id).all()
    else:
        match_reports = db.query(models.MatchReport).filter(models.MatchReport.user_id == user_id, models.MatchReport.is_public == True).all()
    if not match_reports:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found"
        )
    return match_reports

@router.patch("/{match_report_id}", response_model=schemas.MatchReportDisplay)
def update_match_report(updated_match_report: schemas.MatchReportCreate,match_report_id: int, db: Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(get_current_user)):
    match_report = db.query(models.MatchReport).filter(models.MatchReport._id == match_report_id).first()
    if not match_report:
        raise HTTPException(status_code=404, detail= f"Match report with id {match_report_id} not found")
    new_data = updated_match_report.model_dump(exclude_unset=True)
    for key, value in new_data.items():
        setattr(match_report, key, value)
    db.commit()
    db.refresh(match_report)
    return match_report

    
    