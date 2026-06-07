from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn

from routers import battles, models, leaderboard, stream
from database import engine, Base
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Dreams Arena AI",
    description="منصة مقارنة نماذج الذكاء الاصطناعي",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(battles.router, prefix="/api/battles", tags=["battles"])
app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])
app.include_router(stream.router, prefix="/api/stream", tags=["stream"])

@app.get("/")
async def root():
    return {"message": "Dreams Arena AI يعمل ✅", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
