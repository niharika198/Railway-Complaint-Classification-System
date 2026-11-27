
import os
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

BASE_DIR = Path(__file__).resolve().parent.parent.parent
load_dotenv(BASE_DIR / ".env")

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise ValueError("MONGODB_URL is not configured in .env")

client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000
)

db = client["railway_complaint_db"]

users_collection = db["users"]
complaints_collection = db["complaints"]


def test_connection():
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully!")
        return True

    except Exception as e:
        print("MongoDB connection failed:", e)
        return False
