from pydantic import BaseModel, EmailStr, validator
import re


class RegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str

    @validator("username")
    def validate_username(cls, value):
        value = value.strip()

        if len(value) < 3:
            raise ValueError("Username must be at least 3 characters")

        if len(value) > 25:
            raise ValueError("Username cannot exceed 25 characters")

        if not re.match(r"^[a-zA-Z0-9_]+$", value):
            raise ValueError(
                "Username can contain only letters, numbers and underscores"
            )

        return value

    @validator("password")
    def validate_password(cls, value):

        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain an uppercase letter")

        if not re.search(r"[a-z]", value):
            raise ValueError("Password must contain a lowercase letter")

        if not re.search(r"\d", value):
            raise ValueError("Password must contain a number")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain a special character")

        return value


class LoginSchema(BaseModel):
    email: EmailStr
    password: str
