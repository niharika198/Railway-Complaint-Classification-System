
from fastapi import APIRouter, Depends, Query

from app.dependencies.auth_dependencies import get_admin_user
from app.models.complaint import ComplaintStatusUpdate

from app.services.admin_complaint_service import (
    get_all_complaints_service,
    get_admin_complaint_details_service,
    update_complaint_status_service,
    get_admin_dashboard_stats_service
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


@router.get("/dashboard/stats")
def get_dashboard_stats(
    current_admin: dict = Depends(get_admin_user)
):
    return get_admin_dashboard_stats_service()


@router.get("/complaints")
def get_all_complaints(
    status: str = Query(default=None),
    category: str = Query(default=None),
    search: str = Query(default=None),
    current_admin: dict = Depends(get_admin_user)
):
    return get_all_complaints_service(
        status,
        category,
        search
    )


@router.get("/complaints/{complaint_id}")
def get_complaint_details(
    complaint_id: str,
    current_admin: dict = Depends(get_admin_user)
):
    return get_admin_complaint_details_service(
        complaint_id
    )


@router.patch("/complaints/{complaint_id}/status")
def update_complaint_status(
    complaint_id: str,
    request: ComplaintStatusUpdate,
    current_admin: dict = Depends(get_admin_user)
):
    return update_complaint_status_service(
        complaint_id,
        request.status
    )
