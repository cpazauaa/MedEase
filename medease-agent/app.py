import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from agent import root_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai.types import Content, Part
from pydantic import BaseModel

app = FastAPI()

class AgentRequest(BaseModel):
    question: str
    user_id: str
    session_id: str

async def event_generator(question: str, user_id: str, session_id: str):
    new_message = Content(parts=[Part(text=question)])
    service = InMemorySessionService()
    session = service.create_session_sync(
        app_name="medease-agent",
        user_id=user_id,
        session_id=session_id
    )
    runner = Runner(
        app_name="medease-agent",
        agent=root_agent, 
        session_service=service
    )
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=new_message,
    ):
        # Convert event to JSON
        yield event.model_dump_json() + "\n"

@app.post("/agent/respond")
async def respond(request: AgentRequest):
    """
    Stream the agent's events as JSON objects.
    Each line in the response is a JSON object representing an Event.
    """
    question = request.question
    user_id = request.user_id
    session_id = request.session_id
    return StreamingResponse(
        event_generator(question, user_id, session_id),
        media_type="application/json"
    )