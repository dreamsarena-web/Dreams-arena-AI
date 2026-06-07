from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db, AIModel

router = APIRouter()

@router.get("/")
async def get_models(db: Session = Depends(get_db)):
    models = db.query(AIModel).filter(AIModel.is_active == True).all()
    return [
        {
            "id": str(m.id),
            "name": m.display_name,
            "provider": m.provider,
            "description": m.description,
            "elo_score": m.elo_score,
            "total_battles": m.total_battles
        }
        for m in models
    ]
