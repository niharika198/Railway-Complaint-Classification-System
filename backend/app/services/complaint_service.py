
from datetime import datetime, timezone
from bson import ObjectId

from fastapi import HTTPException

from app.database.connection import complaints_collection
from app.services.ml_service import predict_complaint


def submit_complaint_service(complaint, current_user):

    try:
        prediction = predict_complaint(
            complaint.complaint_text
        )

        new_complaint = {
            "user_id": current_user["id"],
            "complaint_text": prediction["original_complaint"],
            "cleaned_text": prediction["cleaned_complaint"],
            "predicted_cluster": prediction["predicted_cluster"],
            "predicted_category": prediction["predicted_category"],
            "status": "Submitted",
            "created_at": datetime.now(timezone.utc)
        }

        result = complaints_collection.insert_one(
            new_complaint
        )

        return {
            "success": True,
            "message": "Complaint submitted successfully!",
            "complaint": {
                "id": str(result.inserted_id),
                "category": prediction["predicted_category"],
                "cluster_id": prediction["predicted_cluster"],
                "status": "Submitted",
                "created_at": new_complaint["created_at"]
            }
        }

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

    except Exception:
        import traceback
        print("COMPLAINT SUBMISSION ERROR:")
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail="Unable to submit complaint. Please try again."
        )


def get_my_complaints_service(current_user):

    complaints = complaints_collection.find(
        {"user_id": current_user["id"]}
    ).sort("created_at", -1)

    complaint_list = []

    for complaint in complaints:
        complaint_list.append({
            "id": str(complaint["_id"]),
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


def get_complaint_details_service(complaint_id, current_user):

    if not ObjectId.is_valid(complaint_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid complaint ID."
        )

    complaint = complaints_collection.find_one({
        "_id": ObjectId(complaint_id),
        "user_id": current_user["id"]
    })

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found."
        )

    return {
        "success": True,
        "complaint": {
            "id": str(complaint["_id"]),
            "complaint_text": complaint["complaint_text"],
            "cleaned_text": complaint["cleaned_text"],
            "predicted_category": complaint["predicted_category"],
            "predicted_cluster": complaint["predicted_cluster"],
            "status": complaint["status"],
            "created_at": complaint["created_at"]
        }
    }
