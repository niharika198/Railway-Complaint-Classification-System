
from datetime import datetime, timezone
from fastapi import HTTPException

from app.database.connection import users_collection
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)


def register_user_service(user):
    existing_user = users_collection.find_one({
        "email": user.email.lower()
    })

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    new_user = {
        "name": user.name.strip(),
        "email": user.email.lower(),
        "phone": user.phone.strip(),
        "pnr": user.pnr.strip(),
        "password": hash_password(user.password),
        "created_at": datetime.now(timezone.utc),
        "role": "user"
    }

    result = users_collection.insert_one(new_user)

    access_token = create_access_token({
        "sub": str(result.inserted_id),
        "email": user.email.lower(),
        "role": "user"
    })

    return {
        "success": True,
        "message": "Registration successful!",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(result.inserted_id),
            "name": new_user["name"],
            "email": new_user["email"],
            "phone": new_user["phone"],
            "pnr": new_user["pnr"],
            "role": new_user["role"]
        }
    }


def login_user_service(user):
    existing_user = users_collection.find_one({
        "email": user.email.lower()
    })

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    access_token = create_access_token({
        "sub": str(existing_user["_id"]),
        "email": existing_user["email"],
        "role": existing_user["role"]
    })

    return {
        "success": True,
        "message": "Login successful!",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(existing_user["_id"]),
            "name": existing_user["name"],
            "email": existing_user["email"],
            "role": existing_user["role"]
        }
    }
