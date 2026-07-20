from sqlalchemy.orm import Session

from app.models.user import User
from app.models.role import Role
from app.models.user_role import UserRole


def assign_role(
    db: Session,
    username: str,
    role_name: str,
):
    user = db.query(User).filter(User.username == username).first()

    if not user:
        print(f"{username} user not found")
        return

    role = db.query(Role).filter(Role.name == role_name).first()

    if not role:
        print(f"{role_name} role not found")
        return

    existing_assignment = (
        db.query(UserRole)
        .filter(
            UserRole.user_id == user.id,
            UserRole.role_id == role.id,
        )
        .first()
    )

    if existing_assignment:
        print(f"{username} already has {role_name} role")
        return

    db.add(
        UserRole(
            user_id=user.id,
            role_id=role.id,
        )
    )

    db.commit()

    print(f"{role_name} role assigned to {username}")


def seed_admin(db: Session):
    assign_role(
        db,
        username="Root",
        role_name="Admin",
    )

    assign_role(
        db,
        username="Employee",
        role_name="Employee",
    )

    assign_role(
        db,
        username="Viewer",
        role_name="Viewer",
    )
