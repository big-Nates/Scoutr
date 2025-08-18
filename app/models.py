from sqlalchemy import Boolean, Column, Integer, String, TIMESTAMP, text, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()



class Team(Base):
    __tablename__ = "teams"

    _id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    number = Column(Integer, unique=True, nullable=False)

    
    match_reports = relationship("MatchReport", back_populates="team")
    self_reports = relationship("SelfReport", back_populates="team")

class User(Base):
    __tablename__ = "users"

    _id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name_initial = Column(String, nullable=False)
    role = Column(String, nullable=False)
    team_number = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text('now()'))
    
    match_reports = relationship("MatchReport", back_populates="user")
    self_reports= relationship("SelfReport", back_populates="user")
    
class SelfReport(Base):
    __tablename__ = "self_reports"

    _id = Column(Integer, primary_key=True)
    
    is_public = Column(Boolean, nullable=False)
    profile_img_url = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    auto_scoring_gamepiece_1 = Column(Integer, nullable=False)
    auto_scoring_gamepiece_2 = Column(Integer, nullable=True)
    can_auto_park = Column(Boolean, primary_key=True, nullable=False)
    spikemark_bonus = Column(Boolean, nullable=True)
    bonus_1 = Column(Boolean, nullable=False, server_default="False")
    bonus_2 = Column(Boolean, nullable=False, server_default="False")
    bonus_3 = Column(Boolean, nullable=False, server_default="False")

    teleop_scoring_gamepiece_1 = Column(Integer, nullable=False)
    teleop_scoring_gamepiece_2 = Column(Integer, nullable=True)
    can_endgame_park = Column(Boolean, primary_key=True, nullable=False)
    ascent_level = Column(Integer, nullable=False)

    additional_info = Column(String, nullable=False)

    creator_id = Column(Integer, ForeignKey("users._id"), nullable=False)
    team_number = Column(Integer,ForeignKey("teams.number"), nullable=False)

    user = relationship("User", back_populates="self_reports")
    team = relationship("Team", back_populates="self_reports")

class MatchReport(Base):
    __tablename__ = "match_reports"

    _id = Column(Integer, primary_key=True)
    is_public = Column(Boolean, nullable=False)

    team_number = Column(Integer, ForeignKey("teams.number"), nullable=False)
    user_id = Column(Integer, ForeignKey("users._id"), nullable=False)
    season = Column(Integer, nullable=False)
    match_number = Column(Integer, nullable=False)
    event_id = Column(Integer, ForeignKey("events._id"), nullable=False)
    tournament_level = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    auto_scoring_gamepiece_1 = Column(Integer, nullable=False)
    auto_scoring_gamepiece_2 = Column(Integer, nullable=True)
    can_auto_park = Column(Boolean, nullable=False)
    spikemark_bonus = Column(Boolean, nullable=True)
    bonus_1 = Column(Boolean, nullable=True, server_default="False")
    bonus_2 = Column(Boolean, nullable=True, server_default="False")
    bonus_3 = Column(Boolean, nullable=True, server_default="False")

    teleop_scoring_gamepiece_1 = Column(Integer, nullable=False)
    teleop_scoring_gamepiece_2 = Column(Integer, nullable=True)
    can_endgame_park = Column(Boolean, nullable=False)
    ascent_level = Column(Integer, nullable=False)

    additional_info = Column(String, nullable=True)

    user = relationship("User", back_populates="match_reports")
    team = relationship("Team", back_populates="match_reports")
    event = relationship("Event", back_populates="match_reports")

class Event(Base):
    __tablename__ = "events"

    _id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)
    code = Column(String, nullable=False)
    type = Column(String, nullable = False)
    season = Column(Integer, nullable=False)

    address = Column(String, nullable=True)
    liveStreamURL = Column(String, nullable=True)

    start = Column(Date, nullable = False)
    started = Column(Boolean, nullable = False)
    ongoing = Column(Boolean, nullable = False)
    finished = Column(Boolean, nullable = False)

    match_reports = relationship("MatchReport", back_populates="event")

    
    








    
