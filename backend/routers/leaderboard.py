from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from database import get_db, AIModel, Battle

router = APIRouter()

@router.get("/")
async def get_leaderboard(
    db: Session = Depends(get_db),
    limit: int = Query(default=20, le=100),
    provider: str = Query(default=None)
):
    query = db.query(AIModel).filter(AIModel.is_active == True)
    
    if provider:
        query = query.filter(AIModel.provider == provider)
    
    models = query.order_by(desc(AIModel.elo_score)).limit(limit).all()
    
    result = []
    for i, model in enumerate(models, 1):
        win_rate = 0
        if model.total_battles > 0:
            win_rate = round((model.total_wins / model.total_battles) * 100, 1)
        
        result.append({
            "rank": i,
            "id": str(model.id),
            "name": model.display_name,
            "provider": model.provider,
            "elo_score": model.elo_score,
            "total_battles": model.total_battles,
            "total_wins": model.total_wins,
            "total_losses": model.total_losses,
            "total_ties": model.total_ties,
            "win_rate": win_rate
        })
    
    return {"leaderboard": result, "total": len(result)}

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    total_battles = db.query(Battle).count()
    total_votes = db.query(Battle).filter(Battle.winner != None).count()
    total_models = db.query(AIModel).filter(AIModel.is_active == True).count()
    
    return {
        "total_battles": total_battles,
        "total_votes": total_votes,
        "total_models": total_models,
        "total_users": 0
    }
