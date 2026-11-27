
from typing import Literal

from pydantic import BaseModel, Field


class ComplaintRequest(BaseModel):
    complaint_text: str = Field(
        min_length=5,
        max_length=5000
    )


class ComplaintStatusUpdate(BaseModel):
    status: Literal[
        "Submitted",
        "In Progress",
        "Resolved"
    ]
