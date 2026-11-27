
from fastapi import APIRouter, Depends

from app.models.complaint import ComplaintRequest
from app.dependencies.auth_dependencies import get_current_user

from app.services.complaint_service import (
    submit_complaint_service,
    get_my_complaints_service,
    get_complaint_details_service
)


router = APIRouter(
    prefix="/api/complaints",
    tags=["Complaints"]
)


@router.post("/submit")
def submit_complaint(
    complaint: ComplaintRequest,
    current_user: dict = Depends(get_current_user)
):
    return submit_complaint_service(
        complaint,
        current_user
    )


@router.get("/my-complaints")
def get_my_complaints(
    current_user: dict = Depends(get_current_user)
):
    return get_my_complaints_service(current_user)


@router.get("/{complaint_id}")
def get_complaint_details(
    complaint_id: str,
    current_user: dict = Depends(get_current_user)
):
    return get_complaint_details_service(
        complaint_id,
        current_user
    )
