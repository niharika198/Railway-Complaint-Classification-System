
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.routes.auth_routes import router as auth_router
from app.routes.complaint_routes import router as complaint_router
from app.routes.admin_complaint_routes import router as admin_complaint_router

from app.services.ml_service import predict_complaint
from app.models.complaint import ComplaintRequest


app = FastAPI(
    title="Railway Complaint Classification API",
    description="API for classifying railway complaints using NLP and K-Means clustering.",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


# Register API routers
app.include_router(auth_router)
app.include_router(complaint_router)
app.include_router(admin_complaint_router)


@app.get("/")
def home():
    return {
        "message": "Railway Complaint Classification API is running!"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Railway Complaint Classification API",
        "ml_model": "loaded"
    }


@app.post("/api/classify")
def classify_complaint(request: ComplaintRequest):
    try:
        result = predict_complaint(request.complaint_text)

        return {
            "success": True,
            "message": "Complaint classified successfully",
            "data": result
        }

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=str(e)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="An internal error occurred during classification."
        )
