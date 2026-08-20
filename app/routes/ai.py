from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_service import (
    suggest_description_service,
    generate_task_analysis
)


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class AISuggestionRequest(BaseModel):
    title: str


class AIAnalysisRequest(BaseModel):
    title: str
    description: str


@router.post("/suggest-description")
def suggest_description(
    request: AISuggestionRequest
):
    description = suggest_description_service(
        request.title
    )

    return {
        "description": description
    }


@router.post("/analyze-task")
def analyze_task(
    request: AIAnalysisRequest
):
    result = generate_task_analysis(
        request.title,
        request.description
    )

    return result