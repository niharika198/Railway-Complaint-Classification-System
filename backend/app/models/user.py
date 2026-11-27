
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str = Field(
        min_length=10,
        max_length=15,
        pattern=r"^[0-9+\-\s]{10,15}$"
    )

    pnr: str = Field(
        min_length=10,
        max_length=10,
        pattern=r"^[0-9]{10}$"
    )

    password: str = Field(
        min_length=8,
        max_length=128
    )


class LoginRequest(BaseModel):
    email: EmailStr

    password: str = Field(
        min_length=1,
        max_length=128
    )
