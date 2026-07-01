from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT

from app.schemas.auth import RegisterSchema, LoginSchema
from app.services.auth import register_user, login_user
from app.core.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# ✅ REGISTER
@router.post("/register")
def register(data: RegisterSchema):
    user = register_user(data)

    return {
        "message": "User registered ✅",
        "user": {"id": user.id, "username": user.username, "email": user.email},
    }


# ✅ LOGIN
@router.post("/login")
def login(data: LoginSchema, Authorize: AuthJWT = Depends()):
    user = login_user(data)

    token = create_access_token(Authorize, user.email)

    return {"message": "Login successful ✅", "access_token": token}


# ✅ LOGOUT
@router.post("/logout")
def logout():
    return {"message": "Logged out ✅"}
