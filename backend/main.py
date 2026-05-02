from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from helper_function import get_llm_response
app = FastAPI()

chat_history = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
    "https://ai-chatbot-plum-five-76.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class chatreq(BaseModel):
    message: str

@app.post("/chat")
def chat(req: chatreq):
    reply = get_llm_response(req.message, chat_history)
    chat_history.append({"role": "user", "content": req.message})
    chat_history.append({"role": "assistant", "content": reply})
    return {"reply": reply}