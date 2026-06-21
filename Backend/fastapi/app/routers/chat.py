from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.core.config import settings
import logging

router = APIRouter(tags=["Chat"])
logger = logging.getLogger("api")

genai.configure(api_key=settings.GEMINI_API_KEY)

# Use the latest Flash model and give it a strict persona
try:
    model = genai.GenerativeModel(
        'gemini-flash-latest', 
        system_instruction="You are Earth Guardian AI. You are a conversational eco-friendly assistant. Give users short, highly practical tips on reducing their carbon footprint. Never answer questions unrelated to sustainability. Keep your answers brief (under 4 sentences)."
    )
except Exception as e:
    logger.error("Failed to initialize chat model: " + str(e))

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = model.generate_content(request.message)
        return {"reply": response.text.strip()}
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate response")
