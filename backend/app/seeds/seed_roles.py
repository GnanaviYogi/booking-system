from sqlalchemy.orm import Session

from app.models.role import Role


def seed_roles(db: Session):
    roles = [
        {
            "name": "Admin",
            "description": "System administrator",
        },
        {
            "name": "Employee",
            "description": "Regular employee",
        },
        {
            "name": "Viewer",
            "description": "Read only access",
        },
    ]

    for role_data in roles:
        existing_role = db.query(Role).filter(Role.name == role_data["name"]).first()

        if not existing_role:
            db.add(Role(**role_data))

    db.commit()
