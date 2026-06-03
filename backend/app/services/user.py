from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User


# CREATE USER
def create_user_service(db: Session, data):
    existing = db.query(User).filter(User.email == data.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(name=data.name, email=data.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# GET ALL USERS
def get_users_service(db: Session):
    return db.query(User).all()


# GET USER BY ID
def get_user_service(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# UPDATE USER
def update_user_service(db: Session, user_id: int, data):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.name:
        user.name = data.name

    if data.email:
        user.email = data.email

    db.commit()
    db.refresh(user)

    return user


# DELETE USER
def delete_user_service(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}
