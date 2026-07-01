from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

from app.db.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password, verify_password


def register_user(data):
    db = SessionLocal()

    try:
        # ✅ check existing user
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        # ✅ store in DB ✅ (THIS IS YOUR REQUIREMENT)
        new_user = User(
            username=data.username,
            email=data.email,
            password=hash_password(data.password),
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        db.close()


def login_user(data):
    db = SessionLocal()

    try:
        # ✅ fetch from DB ✅
        user = db.query(User).filter(User.email == data.email).first()

        if not user or not verify_password(data.password, user.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return user

    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error")

    finally:
        db.close()
