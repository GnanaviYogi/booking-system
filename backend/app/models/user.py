from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(25),
        unique=True,
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        nullable=False,
    )

    password = Column(
        String(255),
        nullable=False,
    )

    roles = relationship(
        "Role",
        secondary="user_roles",
        back_populates="users",
    )
