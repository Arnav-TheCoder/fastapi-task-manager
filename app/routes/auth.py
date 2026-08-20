from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_user

from app.services.auth_service import login_user_service


router = APIRouter(
    tags=["Authentication"]
)


@router.post("/login")
def login(
    user: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    return login_user_service(
        db,
        user.username,
        user.password
    )


@router.get("/protected")
def protected_route(
    current_user: str = Depends(get_current_user)
):
    return {
        "message": "You have access to this protected endpoint!",
        "username": current_user
    }