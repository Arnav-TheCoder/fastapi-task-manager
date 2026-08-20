from groq import Groq
import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-20b"
)


def clean_ai_text(text: str) -> str:
    text = text.strip()

    # Remove markdown code fences if the model adds them
    text = re.sub(
        r"^```(?:text|markdown)?\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\s*```$",
        "",
        text
    )

    return text.strip()


def suggest_description_service(title: str):

    prompt = f"""
Create a short, practical task description.

Task title: {title}

Rules:
- Return ONLY the description.
- Write 1 to 3 sentences.
- Be specific and useful.
- Do not use headings.
- Do not use bullet points.
- Do not include a due date.
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You generate concise task descriptions. "
                        "Always return a non-empty description."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=150
        )

        result = response.choices[0].message.content

        if not result:
            raise ValueError(
                "AI returned an empty response"
            )

        result = clean_ai_text(result)

        if not result:
            raise ValueError(
                "AI returned an empty description"
            )

        return result

    except Exception as error:
        print("AI description error:", error)

        return (
            f"Complete the task: {title.strip()}."
        )


def generate_task_analysis(
    title: str,
    description: str
):

    prompt = f"""
Analyze this task.

Task title:
{title}

Task description:
{description}

Return ONLY valid JSON:

{{
    "priority": "High",
    "estimated_time": "2 hours"
}}

Priority must be exactly:
High, Medium, or Low

Estimated time must be a short value such as:
30 minutes
1 hour
2 hours
1 day
2 days
1 week

Do not include markdown.
Do not include explanations.
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You analyze tasks and return valid JSON only."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=100
        )

        raw_response = (
            response.choices[0].message.content or ""
        ).strip()

        # Remove markdown fences if present
        raw_response = re.sub(
            r"^```json\s*",
            "",
            raw_response,
            flags=re.IGNORECASE
        )

        raw_response = re.sub(
            r"\s*```$",
            "",
            raw_response
        ).strip()

        result = json.loads(raw_response)

        priority = result.get(
            "priority",
            "Medium"
        )

        estimated_time = result.get(
            "estimated_time",
            "Unknown"
        )

        if priority not in [
            "High",
            "Medium",
            "Low"
        ]:
            priority = "Medium"

        return {
            "priority": priority,
            "estimated_time": estimated_time
        }

    except Exception as error:
        print("AI analysis error:", error)

        return {
            "priority": "Medium",
            "estimated_time": "Unknown"
        }