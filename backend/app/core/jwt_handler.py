from fastapi_jwt_auth import AuthJWT


def create_access_token(Authorize: AuthJWT, subject: str):
    return Authorize.create_access_token(subject=subject)


def get_current_user(Authorize: AuthJWT):
    Authorize.jwt_required()
    return Authorize.get_jwt_subject()
