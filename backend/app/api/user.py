from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_jwt_auth import AuthJWT
from app.core.security import verify_password, hash_password  # ✅ add hash_password

from app.db.database import get_db
from app.models.user import User

from app.schemas.user import UserCreate, UserResponse, UserUpdate, UserLogin

from app.services.user import (
    create_user_service,
    get_users_service,
    get_user_service,
    update_user_service,
    delete_user_service,
)

router = APIRouter(prefix="/users", tags=["Users"])


# ============================
# ✅ REGISTER (FIXED)
# ============================
@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()

    if existing:
        raise HTTPException(400, "Email already exists")

    user = User(
        username=data.username,
        email=data.email,
        password=hash_password(data.password),  # ✅ HASH PASSWORD
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User registered successfully"}


# ============================
# ✅ LOGIN (FIXED)
# ============================
@router.post("/login")
def login(
    data: UserLogin,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ IMPORTANT FIX HERE
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = Authorize.create_access_token(subject=data.email)

    return {"access_token": token}


# ============================
# ✅ GET ALL USERS
# ============================
@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
        for user in users
    ]


# ============================
# ✅ GET USER BY ID
# ============================
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(404, "User not found")

    return user


# ============================
# ✅ UPDATE USER
# ============================
@router.patch("/{user_id}", response_model=UserResponse)
def patch_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    return update_user_service(db, user_id, data)


# ============================
# ✅ DELETE USER
# ============================
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return delete_user_service(db, user_id)
