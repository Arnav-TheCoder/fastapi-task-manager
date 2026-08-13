import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen2.5:3b"


def generate_task_description(title: str) -> str:
    prompt = f"""
Generate a concise task description for the following task.

Task title: {title}

Rules:
- Return only the task description.
- Use 1 to 3 sentences.
- Do not use headings.
- Do not use bullet points.
- Do not include a due date.
- Keep it practical and specific.
"""

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": MODEL_NAME,
            "prompt": prompt,
            "stream": False,
        },
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()

    return data["response"].strip()