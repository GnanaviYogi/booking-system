from fastapi import APIRouter, Depends
from app.db.database import SessionLocal
from app.models.user import User

from app.core.rbac import require_permission

router = APIRouter(prefix="/users", tags=["Users"])
from app.schemas.user import (
    ResetPasswordRequest,
)

from app.services.user import (
    reset_password_service,
)
from app.schemas.user import UserUpdate, UserResponse

from app.services.user import (
    update_user_service,
)
from app.schemas.user import (
    ResetPasswordRequest,
    UserUpdate,
    UserResponse,
)

from app.services.user import (
    reset_password_service,
    update_user_service,
)

# ✅ GET ALL USERS (from DB)
from typing import List
from app.schemas.user import UserResponse


@router.get("/", response_model=List[UserResponse])
def get_users(
    current_user=Depends(require_permission("user:view")),
):
    db = SessionLocal()
    users = db.query(User).all()
    db.close()

    return users


# ✅ GET REGISTERED USERS (same as all users here)
@router.get("/registers", response_model=dict[str, List[UserResponse]])
def get_registered_users(
    current_user=Depends(require_permission("user:view")),
):
    db = SessionLocal()
    users = db.query(User).all()
    db.close()

    return {"registered_users": users}


# ✅ GET LOGIN LOGS (if stored separately later)
@router.get("/logins")
def get_login_logs(
    current_user=Depends(require_permission("user:admin")),
):
    return {"logins": "Implement login logs later ✅"}


# ✅ DELETE USER
@router.delete("/{user_id}")
def delete_user(user_id: int):
    return {"message": "User deletion has moved to /auth/me"}


@router.post("/{user_id}/reset-password")
def reset_password(
    user_id: int,
    payload: ResetPasswordRequest,
    current_user=Depends(require_permission("user:view")),
):
    db = SessionLocal()

    try:
        return reset_password_service(
            db,
            user_id,
            payload.new_password,
        )
    finally:
        db.close()


@router.put("/{user_id}")
def update_user(user_id: int):
    return {"message": "User updates have moved to /auth/me"}
