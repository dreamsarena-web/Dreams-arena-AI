from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
import asyncio
import uuid

from services.ai_service import ai_service
from database import SessionLocal, AIModel, Battle

router = APIRouter()

class StreamRequest(BaseModel):
    battle_id: str
    model_id: str
    model_slot: str
    prompt: str

@router.post("/battle")
async def stream_battle_response(request: StreamRequest):
    db = SessionLocal()
    try:
        model = db.query(AIModel).filter(
            AIModel.id == uuid.UUID(request.model_id)
        ).first()
        
        if not model:
            raise HTTPException(status_code=404, detail="النموذج غير موجود")
        
        async def generate():
            full_response = ""
            try:
                async for chunk in ai_service.get_response(
                    model.provider, 
                    model.model_id, 
                    request.prompt
                ):
                    full_response += chunk
                    data = json.dumps({"chunk": chunk, "done": False}, ensure_ascii=False)
                    yield f"data: {data}\n\n"
                    await asyncio.sleep(0)
                
                battle = db.query(Battle).filter(
                    Battle.id == uuid.UUID(request.battle_id)
                ).first()
                
                if battle:
                    if request.model_slot == "a":
                        battle.response_a = full_response
                    else:
                        battle.response_b = full_response
                    db.commit()
                
                yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
                
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
            finally:
                db.close()
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no"
            }
        )
    except Exception as e:
        db.close()
        raise HTTPException(status_code=500, detail=str(e))
