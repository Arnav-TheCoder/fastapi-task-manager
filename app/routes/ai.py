from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ai_service import suggest_description_service


router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


class AISuggestionRequest(BaseModel):
    title: str


@router.post("/suggest-description")
def suggest_description(request: AISuggestionRequest):
    description = suggest_description_service(
        request.title
    )

    return {
        "description": description
    }