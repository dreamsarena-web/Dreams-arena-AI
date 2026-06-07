from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid
import random

from database import get_db, Battle, AIModel
from services.elo_service import elo_service

router = APIRouter()

class CreateBattleRequest(BaseModel):
    prompt: str
    category: Optional[str] = "general"
    language: Optional[str] = "ar"

class VoteRequest(BaseModel):
    battle_id: str
    winner: str
    user_id: Optional[str] = None

@router.post("/create")
async def create_battle(request: CreateBattleRequest, db: Session = Depends(get_db)):
    active_models = db.query(AIModel).filter(AIModel.is_active == True).all()
    
    if len(active_models) < 2:
        raise HTTPException(status_code=400, detail="لا توجد نماذج كافية")
    
    selected = random.sample(active_models, 2)
    model_a, model_b = selected[0], selected[1]
    
    battle = Battle(
        model_a_id=model_a.id,
        model_b_id=model_b.id,
        prompt=request.prompt,
        category=request.category,
        language=request.language
    )
    db.add(battle)
    db.commit()
    db.refresh(battle)
    
    return {
        "battle_id": str(battle.id),
        "prompt": battle.prompt,
        "model_a": {
            "id": str(model_a.id),
            "provider": model_a.provider,
            "model_id": model_a.model_id,
            "label": "النموذج A"
        },
        "model_b": {
            "id": str(model_b.id),
            "provider": model_b.provider,
            "model_id": model_b.model_id,
            "label": "النموذج B"
        }
    }

@router.post("/vote")
async def vote(request: VoteRequest, db: Session = Depends(get_db)):
    battle = db.query(Battle).filter(
        Battle.id == uuid.UUID(request.battle_id)
    ).first()
    
    if not battle:
        raise HTTPException(status_code=404, detail="المعركة غير موجودة")
    
    if battle.winner:
        raise HTTPException(status_code=400, detail="تم التصويت مسبقاً")
    
    if request.winner not in ["A", "B", "tie", "both_bad"]:
        raise HTTPException(status_code=400, detail="تصويت غير صالح")
    
    battle.winner = request.winner
    db.commit()
    
    elo_changes = elo_service.update_ratings(db, battle)
    
    model_a = db.query(AIModel).filter(AIModel.id == battle.model_a_id).first()
    model_b = db.query(AIModel).filter(AIModel.id == battle.model_b_id).first()
    
    return {
        "success": True,
        "winner": request.winner,
        "revealed": {
            "model_a": model_a.display_name,
            "model_b": model_b.display_name
        },
        "elo_changes": elo_changes
    }
