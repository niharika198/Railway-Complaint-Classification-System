
import re

from bson import ObjectId
from fastapi import HTTPException

from app.database.connection import (
    complaints_collection,
    users_collection
)


def get_all_complaints_service(
    status=None,
    category=None,
    search=None
):
    complaints = list(
        complaints_collection.find().sort("created_at", -1)
    )

    # Fetch passenger information
    user_ids = list({
        complaint["user_id"]
        for complaint in complaints
    })

    users = users_collection.find({
        "_id": {
            "$in": [
                ObjectId(user_id)
                for user_id in user_ids
                if ObjectId.is_valid(user_id)
            ]
        }
    })

    user_map = {
        str(user["_id"]): user
        for user in users
    }

    complaint_list = []

    for complaint in complaints:
        user = user_map.get(complaint["user_id"], {})

        passenger_name = user.get("name", "Unknown")
        passenger_email = user.get("email", "Unknown")

        # Status filter
        if status and complaint["status"] != status:
            continue

        # Category filter
        if category and complaint["predicted_category"] != category:
            continue

        # Search by complaint ID or passenger details
        if search:
            search_text = search.lower()

            searchable_fields = [
                str(complaint["_id"]).lower(),
                passenger_name.lower(),
                passenger_email.lower()
            ]

            if not any(
                search_text in field
                for field in searchable_fields
            ):
                continue

        complaint_list.append({
            "id": str(complaint["_id"]),
            "user_id": complaint["user_id"],
            "passenger_name": passenger_name,
            "passenger_email": passenger_email,
            "complaint_text": complaint["complaint_text"],
            "predicted_category": complaint["predicted_category"],
            "predicted_cluster": complaint["predicted_cluster"],
            "status": complaint["status"],
            "created_at": complaint["created_at"]
        })

    return {
        "success": True,
        "total_complaints": len(complaint_list),
        "complaints": complaint_list
    }


def get_admin_complaint_details_service(complaint_id):

    if not ObjectId.is_valid(complaint_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid complaint ID."
        )

    complaint = complaints_collection.find_one({
        "_id": ObjectId(complaint_id)
    })

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found."
        )

    user = users_collection.find_one({
        "_id": ObjectId(complaint["user_id"])
    })

    return {
        "success": True,
        "complaint": {
            "id": str(complaint["_id"]),
            "user_id": complaint["user_id"],
            "passenger_name": user["name"] if user else "Unknown",
            "passenger_email": user["email"] if user else "Unknown",
            "complaint_text": complaint["complaint_text"],
            "cleaned_text": complaint["cleaned_text"],
            "predicted_category": complaint["predicted_category"],
            "predicted_cluster": complaint["predicted_cluster"],
            "status": complaint["status"],
            "created_at": complaint["created_at"]
        }
    }


def update_complaint_status_service(
    complaint_id,
    new_status
):

    if not ObjectId.is_valid(complaint_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid complaint ID."
        )

    result = complaints_collection.update_one(
        {"_id": ObjectId(complaint_id)},
        {
            "$set": {
                "status": new_status
            }
        }
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found."
        )

    return {
        "success": True,
        "message": "Complaint status updated successfully!",
        "complaint_id": complaint_id,
        "status": new_status
    }


def get_admin_dashboard_stats_service():

    total = complaints_collection.count_documents({})

    submitted = complaints_collection.count_documents({
        "status": "Submitted"
    })

    in_progress = complaints_collection.count_documents({
        "status": "In Progress"
    })

    resolved = complaints_collection.count_documents({
        "status": "Resolved"
    })

    recent_complaints = list(
        complaints_collection.find().sort(
            "created_at", -1
        ).limit(5)
    )

    recent_list = []

    for complaint in recent_complaints:
        user = users_collection.find_one({
            "_id": ObjectId(complaint["user_id"])
        })

        recent_list.append({
            "id": str(complaint["_id"]),
            "passenger_name": user["name"] if user else "Unknown",
            "predicted_category": complaint["predicted_category"],
            "status": complaint["status"],
            "created_at": complaint["created_at"]
        })

    return {
        "success": True,
        "statistics": {
            "total_complaints": total,
            "submitted_complaints": submitted,
            "in_progress_complaints": in_progress,
            "resolved_complaints": resolved
        },
        "recent_complaints": recent_list
    }
