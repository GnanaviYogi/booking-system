from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password
from app.core.security import verify_password


# ✅ CREATE USER
def create_user_service(db: Session, data):
    existing = db.query(User).filter(User.email == data.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        username=data.username,  # ✅ fixed field name
        email=data.email,
        password=hash_password(data.password),  # ✅ HASHED PASSWORD
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ✅ GET ALL USERS
def get_users_service(db):
    users = db.query(User).all()
    return users


# ✅ GET USER BY ID
def get_user_service(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ✅ UPDATE USER
def update_user_service(db: Session, user_id: int, data):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.username:
        user.username = data.username

    if data.email:
        user.email = data.email

    if data.password:
        user.password = hash_password(data.password)  # ✅ hash on update also

    db.commit()
    db.refresh(user)

    return user


# ✅ DELETE USER
def delete_user_service(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}
