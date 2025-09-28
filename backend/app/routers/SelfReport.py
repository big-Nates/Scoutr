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

@router.post("/", response_model=schemas.SelfReportBase)
def createMatchReport(self_report_data: schemas.SelfReportCreate,db:Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    
    

    pass

    

