from sqlalchemy import Column, Integer, String, ForeignKey, Time, Date
from sqlalchemy.orm import relationship
from app.db.base import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    user_name = Column(String, nullable=False)  # ✅ FIXED

    room_id = Column(Integer, ForeignKey("rooms.id"))
    required_capacity = Column(Integer)

    date = Column(Date, nullable=False)
    start_time = Column(Time)
    end_time = Column(Time)

    reason = Column(String, nullable=True)

    user = relationship("User")
    room = relationship("Room")
