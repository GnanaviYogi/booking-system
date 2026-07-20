from fastapi import APIRouter, Depends
from fastapi_jwt_auth import AuthJWT

from app.core.dependencies import get_current_user

from app.schemas.auth import (
    RegisterSchema,
    LoginSchema,
)
from app.services.auth import (
    register_user,
    login_user,
)

from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


# REGISTER
@router.post("/register")
def register(data: RegisterSchema):
    user = register_user(data)

    return {
        "message": "User registered ✅",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }


# LOGIN
@router.post("/login")
def login(
    data: LoginSchema,
    Authorize: AuthJWT = Depends(),
):
    user = login_user(data)

    access_token = create_access_token(
        Authorize,
        user.email,
    )

    refresh_token = create_refresh_token(
        Authorize,
        user.email,
    )

    return {
        "message": "Login successful ✅",
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


# REFRESH TOKEN
@router.post("/refresh")
def refresh(
    Authorize: AuthJWT = Depends(),
):
    Authorize.jwt_refresh_token_required()

    current_user = Authorize.get_jwt_subject()

    new_access_token = Authorize.create_access_token(
        subject=current_user,
        expires_time=900,
    )

    return {"access_token": new_access_token}


# LOGOUT
@router.post("/logout")
def logout():
    return {"message": "Logged out ✅"}


@router.get("/me")
def get_me(
    current_user=Depends(get_current_user),
):
    permissions = {
        permission.name
        for role in current_user.roles
        for permission in role.permissions
    }

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "roles": [role.name for role in current_user.roles],
        "permissions": list(permissions),
    }
