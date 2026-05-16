"""CometX Agent Backend — FastAPI + WebSocket"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import os
from planner import Planner
from vision import VisionProcessor
from dom_distiller import DOMDistiller
from memory import MemoryStore

app = FastAPI(title="CometX Agent API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

planner = Planner()
vision = VisionProcessor()
dom_distiller = DOMDistiller()
memory = MemoryStore()


@app.get("/health")
async def health():
    return {"status": "ok", "engine": "CometX", "version": "0.1.0"}


@app.websocket("/ws/agent")
async def agent_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)

            # Extract context from browser
            intent = payload.get("intent", "")
            dom_snapshot = payload.get("dom", {})
            screenshot_b64 = payload.get("screenshot", "")
            url = payload.get("url", "")

            # Distill DOM for token efficiency
            semantic_map = dom_distiller.distill(dom_snapshot)

            # Vision processing
            visual_elements = await vision.analyze(screenshot_b64)

            # Retrieve relevant memory
            context = memory.retrieve(intent)

            # Plan next action
            action = await planner.plan(
                intent=intent,
                semantic_map=semantic_map,
                visual_elements=visual_elements,
                memory_context=context,
                current_url=url,
            )

            await websocket.send_text(json.dumps(action))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_text(json.dumps({"error": str(e)}))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
