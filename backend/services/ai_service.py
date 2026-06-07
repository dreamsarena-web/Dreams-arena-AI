import openai
import anthropic
import google.generativeai as genai
import asyncio
import time
from typing import AsyncGenerator
from config import settings

class AIService:
    def __init__(self):
        self.openai_client = None
        self.anthropic_client = None
        
        if settings.OPENAI_API_KEY:
            self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        if settings.ANTHROPIC_API_KEY:
            self.anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
        
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)

    async def stream_openai(self, model_id: str, prompt: str) -> AsyncGenerator[str, None]:
        try:
            if not self.openai_client:
                yield "[OpenAI API Key غير مضبوط]"
                return
            
            stream = await self.openai_client.chat.completions.create(
                model=model_id,
                messages=[{"role": "user", "content": prompt}],
                stream=True,
                max_tokens=2048,
                temperature=0.7
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            yield f"[خطأ OpenAI: {str(e)}]"

    async def stream_anthropic(self, model_id: str, prompt: str) -> AsyncGenerator[str, None]:
        try:
            if not self.anthropic_client:
                yield "[Anthropic API Key غير مضبوط]"
                return
            
            async with self.anthropic_client.messages.stream(
                model=model_id,
                max_tokens=2048,
                messages=[{"role": "user", "content": prompt}]
            ) as stream:
                async for text in stream.text_stream:
                    yield text
        except Exception as e:
            yield f"[خطأ Anthropic: {str(e)}]"

    async def stream_gemini(self, model_id: str, prompt: str) -> AsyncGenerator[str, None]:
        try:
            if not settings.GOOGLE_API_KEY:
                yield "[Google API Key غير مضبوط]"
                return
            
            model = genai.GenerativeModel(model_id)
            response = await asyncio.to_thread(
                model.generate_content, prompt, stream=True
            )
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    await asyncio.sleep(0)
        except Exception as e:
            yield f"[خطأ Gemini: {str(e)}]"

    async def get_response(self, provider: str, model_id: str, prompt: str) -> AsyncGenerator[str, None]:
        if provider == "openai":
            async for chunk in self.stream_openai(model_id, prompt):
                yield chunk
        elif provider == "anthropic":
            async for chunk in self.stream_anthropic(model_id, prompt):
                yield chunk
        elif provider == "google":
            async for chunk in self.stream_gemini(model_id, prompt):
                yield chunk
        else:
            yield "[نموذج غير مدعوم]"

ai_service = AIService()
