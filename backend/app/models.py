from sqlalchemy import Boolean, Column, Integer, Numeric, String, TIMESTAMP, text, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.orm import declarative_base

Base = declarative_base()



class Team(Base):
    __tablename__ = "teams"

    _id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, unique=True, nullable=False)
    number = Column(Integer, unique=True, nullable=False)
    organization = Column(String, nullable=False, server_default=text("None"))
    rookie_year = Column(Integer, nullable=False, server_default=text("2007"))

    
    match_reports = relationship("MatchReport", back_populates="team")
    self_reports = relationship("SelfReport", back_populates="team")

class User(Base):
    __tablename__ = "users"

    _id = Column(Integer, primary_key=True, autoincrement=True)
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

    _id = Column(Integer, primary_key=True, autoincrement=True)
    is_public = Column(Boolean, nullable=False)

    team_number = Column(Integer, ForeignKey("teams.number"), nullable=False)
    user_id = Column(Integer, ForeignKey("users._id"), nullable=False)
    season = Column(Integer, nullable=False, server_default=text("2025"))
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    classified_amount_auto = Column(Integer, nullable=False, server_default=text("0"))
    overflow_amount_auto = Column(Integer, nullable=False, server_default=text("0"))
    motif_amount_auto = Column(Integer, nullable=False, server_default=text("0"))
    
    classified_amount_teleop = Column(Integer, nullable=False, server_default=text("0"))
    depot_amount_teleop = Column(Integer, nullable=False, server_default=text("0"))
    overflow_amount_teleop = Column(Integer, nullable=False, server_default=text("0"))

    average_collection_time = Column(Numeric(4,2), nullable = True, server_default=text("0"))
    time_to_shoot = Column(Numeric(4,2), nullable = True, server_default=text("0"))
    time_to_park = Column(Numeric(4,2), nullable = True, server_default=text("0"))
    can_deposit_close = Column(Boolean, nullable=False, server_default=text("FALSE"))
    can_deposit_far = Column(Boolean, nullable=False, server_default=text("FALSE"))
    can_park_two_robots = Column(Boolean, nullable=False, server_default=text("FALSE"))

    additional_info = Column(String, nullable=True)
    is_newest = Column(Boolean, nullable=False, server_default=text("TRUE"), default=True)

    user = relationship("User", back_populates="self_reports")
    team = relationship("Team", back_populates="self_reports")

class MatchReport(Base):
    __tablename__ = "match_reports"

    _id = Column(Integer, primary_key=True)
    is_public = Column(Boolean, nullable=False)

    team_number = Column(Integer, nullable=False)
    creator_team_number = Column(Integer, ForeignKey("teams.number"), nullable=False)
    user_id = Column(Integer, ForeignKey("users._id"), nullable=False)
    season = Column(Integer, nullable=False, server_default=text("2025"))
    match_number = Column(Integer, nullable=False)
    event_id = Column(String, nullable=False)
    tournament_level = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    classified_amount_auto = Column(Integer, nullable=False, server_default=text("0"))
    overflow_amount_auto = Column(Integer, nullable=False, server_default=text("0"))
    motif_amount_auto = Column(Integer, nullable=False, server_default=text("0"))
    
    classified_amount_teleop = Column(Integer, nullable=False, server_default=text("0"))
    depot_amount_teleop = Column(Integer, nullable=False, server_default=text("0"))
    overflow_amount_teleop = Column(Integer, nullable=False, server_default=text("0"))

    shots_made_teleop = Column(Integer, nullable=False, server_default=text("0"))
    shots_attempted_teleop = Column(Integer, nullable=False, server_default=text("0"))
    

    classified_amount = Column(Integer, nullable=False)
    depot_amount = Column(Integer, nullable=False)
    can_endgame_park = Column(Boolean, nullable=False)
    ascent_level = Column(Integer, nullable=False)

    additional_info = Column(String, nullable=True)

    user = relationship("User", back_populates="match_reports")
    team = relationship("Team", back_populates="match_reports")


    
    








    
