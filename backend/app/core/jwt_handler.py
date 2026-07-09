from fastapi_jwt_auth import AuthJWT


def create_access_token(
    Authorize: AuthJWT,
    subject: str,
):
    return Authorize.create_access_token(
        subject=subject,
        expires_time=3600,
    )


def create_refresh_token(
    Authorize: AuthJWT,
    subject: str,
):
    return Authorize.create_refresh_token(
        subject=subject,
        expires_time=604800,  # 7 days
    )


def get_current_user(
    Authorize: AuthJWT,
):
    Authorize.jwt_required()
    return Authorize.get_jwt_subject()
