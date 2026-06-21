from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chat_service import handle_chat

router = APIRouter()

class ChatRequest(BaseModel):
    session_id: str
    message: str


@router.post("/chat")
def chat_endpoint(req: ChatRequest):
    return handle_chat(req.session_id, req.message)