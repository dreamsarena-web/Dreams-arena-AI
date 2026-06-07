from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/arena_db"
    REDIS_URL: str = "redis://localhost:6379"
    
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    
    SECRET_KEY: str = "dreams-arena-secret-key"
    FRONTEND_URL: str = "http://localhost:3000"
    
    ELO_K_FACTOR: int = 32
    DEFAULT_ELO: int = 1000
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
