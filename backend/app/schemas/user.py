from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr  # ✅ validates email format


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
