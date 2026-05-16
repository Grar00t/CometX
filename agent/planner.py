"""CometX Planner — Meta Llama 3.1 405B via Azure MaaS"""

import os
from openai import AsyncAzureOpenAI
from typing import Any

SYSTEM_PROMPT = """
You are Nova, the cognitive core of CometX — a sovereign agentic browser.
You are a Mastermind. Your job is to decompose user intent into atomic browser actions.

You MUST respond with valid JSON only. Format:
{
  "action": "click" | "type" | "navigate" | "scroll" | "wait" | "complete" | "ask_user",
  "selector": "CSS selector or element ID (if applicable)",
  "text": "text to type (if action=type)",
  "url": "URL to navigate (if action=navigate)",
  "coordinates": [x, y],
  "reasoning": "brief explanation of why this action",
  "risk_level": "low" | "medium" | "high"
}

For HIGH RISK actions (financial transactions, password changes, data deletion),
always set risk_level=high. The system will pause and ask the user.

You are operating in the Kingdom of Saudi Arabia.
Always respect user privacy and data sovereignty.
"""


class Planner:
    def __init__(self):
        self.client = AsyncAzureOpenAI(
            api_key=os.getenv("AZURE_API_KEY"),
            api_version="2024-08-01-preview",
            azure_endpoint=os.getenv("AZURE_ENDPOINT"),
        )
        self.model = os.getenv("AZURE_MODEL", "Llama-3.1-405B-Instruct")

    async def plan(
        self,
        intent: str,
        semantic_map: dict,
        visual_elements: list,
        memory_context: str,
        current_url: str,
    ) -> dict:
        user_prompt = f"""
User Intent: {intent}
Current URL: {current_url}
Page Elements: {semantic_map}
Visual Elements Detected: {visual_elements}
Relevant Memory: {memory_context}

What is the next single atomic action to take?
"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=512,
                temperature=0.1,
                response_format={"type": "json_object"},
            )
            import json
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {"action": "error", "reasoning": str(e), "risk_level": "low"}
