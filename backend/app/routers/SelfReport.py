from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from ..oauth2 import get_current_user
from backend.app import models, schemas, oauth2
import requests


router = APIRouter(
    prefix="/self_reports",
    tags=["Self Reports"]
)

@router.post("/", response_model=schemas.SelfReportBase, status_code=status.HTTP_200_OK)
def create_Self_Report(self_report_data: schemas.SelfReportCreate,db:Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    db.query(models.SelfReport).filter(models.SelfReport.team_number == current_user.team_number).update({models.SelfReport.is_newest: False})
    newest_self_report = models.SelfReport(user_id = current_user._id,  
                                           team_number = current_user.team_number,
                                           **self_report_data.model_dump())
    db.add(newest_self_report)
    db.commit()
    db.refresh(newest_self_report)
    return newest_self_report

@router.get("/", response_model=List[schemas.SelfReportIconDisplay], status_code=status.HTTP_200_OK)
def get_All_Self_Reports(db:Session = Depends(get_db)):
    queried_reports = db.query(models.SelfReport).filter(models.SelfReport.is_public == True, models.SelfReport.is_newest == True,).all()
    return queried_reports
    
@router.get("/teams/{team_number}", response_model=List[schemas.SelfReportFullDisplay], status_code=status.HTTP_200_OK)
def get_Self_Reports_by_Team(team_number: int, db:Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    if(team_number == current_user.team_number):
        queried_reports = db.query(models.SelfReport).filter(models.SelfReport.team_number == team_number).all()
    else:
        queried_reports = db.query(models.SelfReport).filter(models.SelfReport.team_number == team_number, models.SelfReport.is_public == True).all()
    return queried_reports

@router.get("/{_id}", response_model=List[schemas.SelfReportFullDisplay], status_code=status.HTTP_200_OK)
def get_Self_Report_by_Id(_id: int, db:Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    queried_report_on_team = db.query(models.SelfReport).filter(models.SelfReport._id == _id, models.SelfReport.team_number == current_user.team_number).first()
    if queried_report_on_team is None:
        queried_report = db.query(models.SelfReport).filter(models.SelfReport._id == _id, models.SelfReport.is_public == True).first()
        if not queried_report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Self Report with id of {_id} not found"
            )
        else:
            return queried_report
    else:
        return queried_report_on_team
    
@router.delete("/{id}", response_model=List[schemas.SelfReportFullDisplay], status_code=status.HTTP_200_OK)
def delete_Self_Report(_id: int, db:Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    queried_report = db.query(models.SelfReport).filter(models.SelfReport._id == id, models.SelfReport.team_number == current_user.team_number).first()
    if queried_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Self Report with id of {id} not found"
        )
    db.delete(queried_report)
    db.commit(queried_report)
