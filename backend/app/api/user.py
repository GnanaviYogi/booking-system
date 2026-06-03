from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

# Import schemas safely
from app.schemas.user import UserCreate, UserResponse, UserUpdate

# Import services safely
from app.services.user import (
    create_user_service,
    get_users_service,
    get_user_service,
    update_user_service,
    delete_user_service,
)

# Define router FIRST
router = APIRouter(prefix="/users", tags=["Users"])


# CREATE USER
@router.post("/", response_model=UserResponse)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    return create_user_service(db, data)


# GET ALL USERS
@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return get_users_service(db)


# GET USER BY ID
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    return get_user_service(db, user_id)


# DELETE USER
@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return delete_user_service(db, user_id)


# PARTIAL UPDATE (PATCH)
@router.patch("/{user_id}", response_model=UserResponse)
def patch_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    return update_user_service(db, user_id, data)
