from pydantic import BaseModel, EmailStr
from typing import Optional


class ResetPasswordRequest(BaseModel):
    new_password: str


# ✅ REGISTER SCHEMA
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


# ✅ LOGIN SCHEMA
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ✅ UPDATE SCHEMA
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None


# ✅ RESPONSE SCHEMA
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True  # ✅ REQUIRED for SQLAlchemy
        orm_mode = True
