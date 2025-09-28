import json
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from agent import root_agent
from google.adk.runners import Runner
from google.genai.types import Content, Part

app = FastAPI()

async def event_generator(question: str, user_id: str, session_id: str):
    new_message = Content(parts=[Part(text=question)])
    runner = Runner(agent=root_agent)
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=new_message,
    ):
        # Convert event to JSON
        yield json.dumps(event.model_dump()) + "\n"

@app.post("/agent/respond")
async def respond(question: str, user_id: str, session_id: str):
    """
    Stream the agent's events as JSON objects.
    Each line in the response is a JSON object representing an Event.
    """
    return StreamingResponse(
        event_generator(question, user_id, session_id),
        media_type="application/json"
    )