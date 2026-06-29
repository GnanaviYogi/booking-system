from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi_jwt_auth import AuthJWT

from app.db.database import get_db
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Auth"])


# ✅ REGISTER
@router.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(400, "Username & password required")

    existing = db.query(User).filter(User.username == username).first()
    if existing:
        raise HTTPException(400, "User already exists")

    user = User(username=username, password=password)

    db.add(user)
    db.commit()

    return {"message": "User registered successfully"}


# ✅ LOGIN
@router.post("/login")
def login(
    data: dict,
    db: Session = Depends(get_db),
    Authorize: AuthJWT = Depends(),
):
    username = data.get("username")
    password = data.get("password")

    user = db.query(User).filter(User.username == username).first()

    if not user or user.password != password:
        raise HTTPException(401, "Invalid credentials")

    access_token = Authorize.create_access_token(subject=username)

    return {"access_token": access_token}
