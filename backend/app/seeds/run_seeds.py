from app.db.database import SessionLocal

from app.seeds.seed_roles import seed_roles
from app.seeds.seed_permissions import seed_permissions
from app.seeds.seed_role_permissions import (
    seed_role_permissions,
)
from app.seeds.seed_admin import seed_admin


def run_seeds():
    db = SessionLocal()

    try:
        print("Seeding roles...")
        seed_roles(db)

        print("Seeding permissions...")
        seed_permissions(db)

        print("Seeding role permissions...")
        seed_role_permissions(db)

        print("Assigning admin role...")
        seed_admin(db)

        print("RBAC seeding completed successfully")

    except Exception as e:
        print(f"Seeding failed: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    run_seeds()
