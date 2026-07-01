from fastapi import APIRouter
from app.db.database import SessionLocal
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


# ✅ GET ALL USERS (from DB)
from typing import List
from app.schemas.user import UserResponse


@router.get("/", response_model=List[UserResponse])
def get_users():
    db = SessionLocal()
    users = db.query(User).all()
    db.close()

    return users


# ✅ GET REGISTERED USERS (same as all users here)
@router.get("/registers", response_model=dict[str, List[UserResponse]])
def get_registered_users():
    db = SessionLocal()
    users = db.query(User).all()
    db.close()

    return {"registered_users": users}


# ✅ GET LOGIN LOGS (if stored separately later)
@router.get("/logins")
def get_login_logs():
    return {"logins": "Implement login logs later ✅"}


# ✅ DELETE USER
@router.delete("/{user_id}")
def delete_user(user_id: int):
    db = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        db.close()
        return {"message": "User not found"}

    db.delete(user)
    db.commit()
    db.close()

    return {"message": f"User {user_id} deleted ✅"}
