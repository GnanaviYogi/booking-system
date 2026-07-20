from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi_jwt_auth import AuthJWT

from app.db.database import get_db
from app.models.user import User


def get_current_user(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
):
    Authorize.jwt_required()

    user_email = Authorize.get_jwt_subject()

    user = db.query(User).filter(User.email == user_email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user
