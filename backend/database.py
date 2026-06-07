from sqlalchemy import create_engine, Column, String, Integer, Boolean, Text, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    avatar_url = Column(Text)
    provider = Column(String(50), default='email')
    total_votes = Column(Integer, default=0)
    reputation_score = Column(Integer, default=0)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    battles = relationship("Battle", back_populates="user")

class AIModel(Base):
    __tablename__ = "models"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    display_name = Column(String(150), nullable=False)
    provider = Column(String(50), nullable=False)
    api_endpoint = Column(Text)
    model_id = Column(String(100), nullable=False)
    description = Column(Text)
    avatar_url = Column(Text)
    is_active = Column(Boolean, default=True)
    elo_score = Column(Integer, default=1000)
    total_battles = Column(Integer, default=0)
    total_wins = Column(Integer, default=0)
    total_losses = Column(Integer, default=0)
    total_ties = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Battle(Base):
    __tablename__ = "battles"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    model_a_id = Column(UUID(as_uuid=True), ForeignKey("models.id"))
    model_b_id = Column(UUID(as_uuid=True), ForeignKey("models.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    prompt = Column(Text, nullable=False)
    response_a = Column(Text)
    response_b = Column(Text)
    winner = Column(String(10))
    category = Column(String(50), default='general')
    language = Column(String(10), default='ar')
    ip_address = Column(String(50))
    response_time_a = Column(Integer)
    response_time_b = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="battles")
    model_a = relationship("AIModel", foreign_keys=[model_a_id])
    model_b = relationship("AIModel", foreign_keys=[model_b_id])

class EloHistory(Base):
    __tablename__ = "elo_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    model_id = Column(UUID(as_uuid=True), ForeignKey("models.id"))
    battle_id = Column(UUID(as_uuid=True), ForeignKey("battles.id"))
    old_elo = Column(Integer, nullable=False)
    new_elo = Column(Integer, nullable=False)
    change = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
