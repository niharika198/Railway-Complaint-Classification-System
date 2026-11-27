
from fastapi import APIRouter, Depends

from app.models.user import RegisterRequest, LoginRequest
from app.services.auth_service import (
    register_user_service,
    login_user_service
)
from app.dependencies.auth_dependencies import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register_user(user: RegisterRequest):
    return register_user_service(user)


@router.post("/login")
def login_user(user: LoginRequest):
    return login_user_service(user)


@router.get("/me")
def get_my_profile(
    current_user: dict = Depends(get_current_user)
):
    return {
        "success": True,
        "user": current_user
    }
