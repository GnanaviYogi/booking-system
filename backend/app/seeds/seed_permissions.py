from sqlalchemy.orm import Session

from app.models.permission import Permission


def seed_permissions(db: Session):
    permissions = [
        {
            "name": "booking:view",
            "description": "View bookings",
        },
        {
            "name": "booking:create",
            "description": "Create bookings",
        },
        {
            "name": "booking:update",
            "description": "Update bookings",
        },
        {
            "name": "booking:delete",
            "description": "Delete bookings",
        },
        {
            "name": "room:view",
            "description": "View rooms",
        },
        {
            "name": "user:view",
            "description": "View users",
        },
        {
            "name": "user:delete",
            "description": "Delete users",
        },
    ]

    for permission_data in permissions:
        existing_permission = (
            db.query(Permission)
            .filter(Permission.name == permission_data["name"])
            .first()
        )

        if not existing_permission:
            db.add(Permission(**permission_data))

    db.commit()
