import requests
import json

from app.config import OLLAMA_URL, OLLAMA_MODEL


def generate_task_analysis(title: str, description: str):
    prompt = f"""
Analyze the following task.

Task title:
{title}

Task description:
{description}

Return ONLY valid JSON in this exact format:

{{
    "priority": "High",
    "estimated_time": "2 hours"
}}

Priority must be exactly one of:
High, Medium, Low

Estimated time should be a short human-readable value such as:
30 minutes
1 hour
2 hours
1 day
2 days
1 week

Do not include markdown.
Do not include explanations.
Return only JSON.
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        raw_response = data.get("response", "").strip()

        try:
            result = json.loads(raw_response)

        except json.JSONDecodeError:
            return {
                "priority": "Medium",
                "estimated_time": "Unknown"
            }

        priority = result.get(
            "priority",
            "Medium"
        )

        estimated_time = result.get(
            "estimated_time",
            "Unknown"
        )

        if priority not in ["High", "Medium", "Low"]:
            priority = "Medium"

        return {
            "priority": priority,
            "estimated_time": estimated_time
        }

    except Exception as error:
        print("AI error:", error)

        return {
            "priority": "Medium",
            "estimated_time": "Unknown"
        }


def suggest_description_service(title: str):
    prompt = f"""
Create a short and useful task description for this task:

{title}

Return only the description.
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()

        data = response.json()

        return data.get(
            "response",
            ""
        ).strip()

    except Exception as error:
        print("AI error:", error)

        return "Unable to generate description."