from datetime import datetime
from sqlalchemy import TIMESTAMP
from typing import Literal, Optional, List
from pydantic import BaseModel, EmailStr



class ConfigBase(BaseModel):
    model_config = {
        "from_attributes": True,  # 👈 This replaces orm_mode
        "extra": "ignore"
    }
    

class TeamBase(ConfigBase):
    name: str
    number: int

class TeamCreate(TeamBase):
    pass

class TeamDisplay(TeamBase):
    _id: int

class UserBase(ConfigBase):
    first_name: str
    last_name_initial: str
    team_number: int

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserDisplay(UserBase):
    _id: int
    role: str
    team_number: int

class SelfReportBase(ConfigBase):
    is_public: bool
    profile_img_url: Optional[str] = None

    auto_scoring_gamepiece_1: int
    auto_scoring_gamepiece_2: Optional[int] = 0
    can_auto_park: bool
    spikemark_bonus: Optional[bool] = None
    bonus_1: bool = False
    bonus_2: bool = False
    bonus_3: bool = False

    teleop_scoring_gamepiece_1: int
    teleop_scoring_gamepiece_2: Optional[int] = 0
    can_endgame_park: bool
    ascent_level: int

    additional_info: str

class SelfReportCreate(SelfReportBase):
    pass

class SelfReportDisplay(SelfReportBase):
    _id: int
    team: Optional[TeamDisplay] = None
    team_id: int
    team_number: int


class MatchReportBase(ConfigBase):
    is_public: bool

    team_number: int
    match_number: int
    tournament_level: str

    auto_scoring_gamepiece_1: int
    auto_scoring_gamepiece_2: Optional[int] = 0
    can_auto_park: bool
    spikemark_bonus: Optional[bool] = False
    bonus_1: Optional[bool] = False
    bonus_2: Optional[bool] = False
    bonus_3: Optional[bool] = False

    teleop_scoring_gamepiece_1: int
    teleop_scoring_gamepiece_2: Optional[int] = 0
    can_endgame_park: bool
    ascent_level: int

    additional_info: Optional[str] = "No additional info about the team"


class MatchReportCreate(MatchReportBase):
    pass

class MatchReportDisplay(SelfReportDisplay):
    pass

class EventBase(ConfigBase):
    code: str
    season: int 

class EventAdd(EventBase):
    pass

class EventCreate(EventBase):
    name:str
    type: str
    address: str
    liveStreamURL: str
    start: datetime
    started: bool
    ongoing: bool
    finished: bool

class EventDisplay(EventBase):
    _id: int
    name:str
    type: str
    address: str
    liveStreamURL: str

class MatchGeneralQuery(ConfigBase):
    season: int
    code: str
    id: int = 0
    series: int = 0

class MatchEventQuery(ConfigBase):
    season: int
    code: str
    

class MatchGeneralInfo(ConfigBase):
    tournamentLevel: Literal["Quals", "DoubleElim", "Finals"]
    hasBeenPlayed: bool
    actualStartTime: str

class MatchTeamInfo(ConfigBase):
    team_number_1: int
    team_number_2: int
    team_number_3: int
    team_number_4: int

class MatchScoreInfo(ConfigBase):
    autoPoints_1: int
    dcPoints_1: int
    totalPointsNp_1: int
    totalPoints_1: int
    autoPoints_2: int
    dcPoints_2: int
    totalPointsNp_2: int
    totalPoints_2: int




TeamDisplay.model_rebuild()
SelfReportDisplay.model_rebuild()
MatchReportDisplay.model_rebuild()



class Token(ConfigBase):
    access_token: str
    token_type: str

    

class TokenData(ConfigBase):
    id: Optional[str] = None
    