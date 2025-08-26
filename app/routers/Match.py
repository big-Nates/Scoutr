from typing import List
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from ..oauth2 import get_current_user
from app import models, schemas, oauth2
import requests, json

router = APIRouter(
    prefix="/matches",
    tags=["Matches"]
)

@router.get("/", response_model=schemas.MatchGeneralInfo)
def get_match_general_info(query: schemas.MatchGeneralQuery, current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    url = f"https://api.ftcscout.org/rest/v1/events/{query.season}/{query.code}/matches"
    response = requests.get(url)
    if response.status_code == 404:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Event with code {query.code} in the {query.season}-{query.season+1} season not found."
        ) 
    matches = response.json()
    matches_list = []
    
    if (query.id != 0 and query.series != 0) or (query.id == 0 and query.series == 0):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"A series and id parameter are not both allowed"
        )
    if query.series == 0:
        for match in matches:
            if match["tournamentLevel"] == "Quals":
                matches_list.append(match)

        if query.id > len(matches_list) or query.id < 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Match doesn't exist"
            )
        return schemas.MatchGeneralInfo(**matches_list[query.id-1])
    else:
        for match in matches:
            if match["tournamentLevel"] == "DoubleElim":
                matches_list.append(match)

        if query.series > len(matches_list) or query.series < 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Playoff match doesn't exist"
            )
    
        return schemas.MatchGeneralInfo(**matches_list[query.series-1])
    
@router.get("/teams", response_model=schemas.MatchTeamInfo)
def get_match_team_info(query: schemas.MatchGeneralQuery, db: Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    url = f"https://api.ftcscout.org/rest/v1/events/{query.season}/{query.code}/matches"
    response = requests.get(url)
    if response.status_code == 404:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Event with code {query.code} in the {query.season}-{query.season+1} season not found."
        ) 
    matches = response.json()
    matches_list = []
    
    if (query.id != 0 and query.series != 0) or (query.id == 0 and query.series == 0):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"A series and id parameter are not both allowed"
        )
    if query.series == 0:
        for match in matches:
            if match["tournamentLevel"] == "Quals":
                matches_list.append(match)

        if query.id > len(matches_list) or query.id < 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Match doesn't exist"
            )
        teams_dict = {}
        i=0
        for team in matches_list[query.id-1]["teams"]:
            i+=1
            teams_dict[f"team_number_{i}"] = team["teamNumber"]
        return schemas.MatchTeamInfo(**teams_dict)
    else:
        for match in matches:
            if match["tournamentLevel"] == "DoubleElim":
                matches_list.append(match)

        if query.series > len(matches_list) or query.series < 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Playoff match doesn't exist"
            )
    
        teams_dict = {}
        i=0
        for team in matches_list[query.series-1]["teams"]:
            i+=1
            teams_dict[f"team_number_{i}"] = team["teamNumber"]
        return schemas.MatchTeamInfo(**teams_dict)
                    
@router.get("/scores", response_model=schemas.MatchScoreInfo)
def get_match_score_info(query: schemas.MatchGeneralQuery, db: Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):    
    url = f"https://api.ftcscout.org/rest/v1/events/{query.season}/{query.code}/matches"
    response = requests.get(url)
    if response.status_code == 404:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Event with code {query.code} in the {query.season}-{query.season+1} season not found."
        ) 
    matches = response.json()
    matches_list = []
    
    if (query.id != 0 and query.series != 0) or (query.id == 0 and query.series == 0):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"A series and id parameter are not both allowed"
        )
    if query.series == 0:
        for match in matches:
            if match["tournamentLevel"] == "Quals":
                matches_list.append(match)

        if query.id > len(matches_list) or query.id < 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Match doesn't exist"
            )
        scores_dict = {}
        scores_dict[f"autoPoints_{1}"] = matches_list[query.id-1]["scores"]["red"]["autoPoints"]
        scores_dict[f"dcPoints_{1}"] = matches_list[query.id-1]["scores"]["red"]["dcPoints"]
        scores_dict[f"totalPointsNp_{1}"] = matches_list[query.id-1]["scores"]["red"]["totalPointsNp"]
        scores_dict[f"totalPoints_{1}"] = matches_list[query.id-1]["scores"]["red"]["totalPoints"]
        scores_dict[f"autoPoints_{2}"] = matches_list[query.id-1]["scores"]["blue"]["autoPoints"]
        scores_dict[f"dcPoints_{2}"] = matches_list[query.id-1]["scores"]["blue"]["dcPoints"]
        scores_dict[f"totalPointsNp_{2}"] = matches_list[query.id-1]["scores"]["blue"]["totalPointsNp"]
        scores_dict[f"totalPoints_{2}"] = matches_list[query.id-1]["scores"]["blue"]["totalPoints"]

        return schemas.MatchScoreInfo(**scores_dict)
    else:
        for match in matches:
            if match["tournamentLevel"] == "DoubleElim":
                matches_list.append(match)

        if query.series > len(matches_list) or query.series < 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Playoff match doesn't exist"
            )
        scores_dict = {}
        scores_dict[f"autoPoints_{1}"] = matches_list[query.series-1]["scores"]["red"]["autoPoints"]
        scores_dict[f"dcPoints_{1}"] = matches_list[query.series-1]["scores"]["red"]["dcPoints"]
        scores_dict[f"totalPointsNp_{1}"] = matches_list[query.series-1]["scores"]["red"]["totalPointsNp"]
        scores_dict[f"totalPoints_{1}"] = matches_list[query.series-1]["scores"]["red"]["totalPoints"]
        scores_dict[f"autoPoints_{2}"] = matches_list[query.series-1]["scores"]["blue"]["autoPoints"]
        scores_dict[f"dcPoints_{2}"] = matches_list[query.series-1]["scores"]["blue"]["dcPoints"]
        scores_dict[f"totalPointsNp_{2}"] = matches_list[query.series-1]["scores"]["blue"]["totalPointsNp"]
        scores_dict[f"totalPoints_{2}"] = matches_list[query.series-1]["scores"]["blue"]["totalPoints"]
        return schemas.MatchScoreInfo(**scores_dict)

@router.get("/{season}/{code}/quals")
def get_match_general_info(season: int, code: str, db: Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    url = f"https://api.ftcscout.org/rest/v1/events/{season}/{code}/matches"
    response = requests.get(url)
    if response.status_code == 404:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Event with code {code} in the {season}-{season+1} season not found."
        ) 
    matches = response.json()
    matches_list = []
    
    for match in matches:
        if match["tournamentLevel"] == "Quals":
            matches_list.append(match)

    returned_matches_list = list()
    match_num=0
    for match in matches_list:
        match_num += 1
        all_match_info = dict()
        all_match_info["matchNumber"] = match_num
        all_match_info["generalMatchInfo"] = schemas.MatchGeneralInfo(**match)
        all_match_info["scores"] = dict()
        all_match_info["scores"]["autoPoints_1"] = match["scores"]["red"]["autoPoints"]
        all_match_info["scores"]["dcPoints_1"] = match["scores"]["red"]["dcPoints"]
        all_match_info["scores"]["totalPointsNp_1"] = match["scores"]["red"]["totalPointsNp"]
        all_match_info["scores"]["totalPoints_1"] = match["scores"]["red"]["totalPoints"]
        all_match_info["scores"]["autoPoints_2"] = match["scores"]["blue"]["autoPoints"]
        all_match_info["scores"]["dcPoints_2"] = match["scores"]["blue"]["dcPoints"]
        all_match_info["scores"]["totalPointsNp_2"] = match["scores"]["blue"]["totalPointsNp"]
        all_match_info["scores"]["totalPoints_2"] = match["scores"]["blue"]["totalPoints"]
        returned_matches_list.append(all_match_info)
    return returned_matches_list
    
@router.get("/{season}/{code}/playoffs")
def get_match_general_info(season: int, code: str, db: Session = Depends(get_db), current_user: schemas.UserDisplay = Depends(oauth2.get_current_user)):
    url = f"https://api.ftcscout.org/rest/v1/events/{season}/{code}/matches"
    response = requests.get(url)
    if response.status_code == 404:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Event with code {code} in the {season}-{season+1} season not found."
        ) 
    matches = response.json()
    matches_list = []
    
    for match in matches:
        if match["tournamentLevel"] == "DoubleElim":
            matches_list.append(match)

    returned_matches_list = list()
    match_num=0
    for match in matches_list:
        match_num += 1
        all_match_info = dict()
        all_match_info["finalsMatchNum"] = match_num
        all_match_info["generalMatchInfo"] = schemas.MatchGeneralInfo(**match)
        all_match_info["scores"] = dict()
        all_match_info["scores"]["autoPoints_1"] = match["scores"]["red"]["autoPoints"]
        all_match_info["scores"]["dcPoints_1"] = match["scores"]["red"]["dcPoints"]
        all_match_info["scores"]["totalPointsNp_1"] = match["scores"]["red"]["totalPointsNp"]
        all_match_info["scores"]["totalPoints_1"] = match["scores"]["red"]["totalPoints"]
        all_match_info["scores"]["autoPoints_2"] = match["scores"]["blue"]["autoPoints"]
        all_match_info["scores"]["dcPoints_2"] = match["scores"]["blue"]["dcPoints"]
        all_match_info["scores"]["totalPointsNp_2"] = match["scores"]["blue"]["totalPointsNp"]
        all_match_info["scores"]["totalPoints_2"] = match["scores"]["blue"]["totalPoints"]
        returned_matches_list.append(all_match_info)
    return returned_matches_list
    