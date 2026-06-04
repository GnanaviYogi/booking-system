from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.booking import Booking
from app.models.room import Room
from app.models.user import User
from sqlalchemy.exc import SQLAlchemyError


# ============================
# ✅ CREATE BOOKING
# ============================
def create_booking_service(db: Session, data):

    # ✅ Check room exists
    room = db.query(Room).filter(Room.name.ilike(data.room_name.strip())).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    # ✅ Get user using name
    user = db.query(User).filter(User.name.ilike(data.user_name.strip())).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ ✅ ✅ LIMIT CHECK (MAX 3 BOOKINGS PER DAY)
    existing_count = (
        db.query(Booking)
        .filter(Booking.user_id == user.id, Booking.date == data.date)
        .count()
    )

    if existing_count >= 3:
        raise HTTPException(
            status_code=400, detail="You cannot book more than 3 rooms in a day"
        )

    # ✅ Capacity check
    if room.capacity < data.required_capacity:
        suitable_rooms = (
            db.query(Room).filter(Room.capacity >= data.required_capacity).all()
        )

        suggestions = [
            {"room_name": r.name, "capacity": r.capacity} for r in suitable_rooms
        ]

        raise HTTPException(
            status_code=400,
            detail={
                "message": "Selected room does not meet capacity requirement",
                "suggested_rooms": suggestions,
            },
        )

    # ✅ Time validation
    start_time_obj = data.start_time
    end_time_obj = data.end_time

    if end_time_obj <= start_time_obj:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # ✅ Overlap check
    overlapping = (
        db.query(Booking)
        .filter(
            Booking.room_id == room.id,
            Booking.date == data.date,
            Booking.start_time < end_time_obj,
            Booking.end_time > start_time_obj,
        )
        .first()
    )

    if overlapping:
        raise HTTPException(
            status_code=400, detail="Room already booked for this time slot"
        )

    # ✅ Create booking (store BOTH)
    booking = Booking(
        user_id=user.id,
        user_name=user.name,
        room_id=room.id,
        date=data.date,
        start_time=start_time_obj,
        end_time=end_time_obj,
        reason=data.reason,
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "user_name": booking.user_name,
        "room_name": room.name,
        "date": booking.date.strftime("%Y-%m-%d"),
        "start_time": booking.start_time.strftime("%H:%M"),
        "end_time": booking.end_time.strftime("%H:%M"),
        "reason": booking.reason,
    }


# ============================
# ✅ GET BOOKINGS (Calendar uses this)
# ============================
def get_bookings_service(db: Session):
    try:
        bookings = db.query(Booking).all()

        return [
            {
                "id": b.id,
                "user_name": b.user_name,  # ✅ important for UI
                "room_name": b.room.name if b.room else "Unknown Room",
                "date": b.date.strftime("%Y-%m-%d") if b.date else None,
                "start_time": b.start_time.strftime("%H:%M") if b.start_time else None,
                "end_time": b.end_time.strftime("%H:%M") if b.end_time else None,
                "reason": b.reason,
            }
            for b in bookings
        ]

    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error occurred")

    except Exception:
        raise HTTPException(status_code=500, detail="Unexpected error occurred")


# ============================
# ✅ DELETE BOOKING
# ============================
def delete_booking_service(db, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found"
        )

    db.delete(booking)
    db.commit()

    return {"message": "Booking deleted successfully"}


# ============================
# ✅ UPDATE BOOKING
# ============================
def update_booking_service(db, booking_id: int, data):

    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # ✅ Update user using name
    if data.user_name:
        user = db.query(User).filter(User.name.ilike(data.user_name.strip())).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        booking.user_id = user.id
        booking.user_name = user.name

    # ✅ Update other fields
    if data.date:
        booking.date = data.date

    if hasattr(data, "start_time") and data.start_time:
        booking.start_time = data.start_time

    if hasattr(data, "end_time") and data.end_time:
        booking.end_time = data.end_time

    if data.reason is not None:
        booking.reason = data.reason

    # ✅ Time validation
    if booking.end_time <= booking.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "user_name": booking.user_name,
        "room_name": booking.room.name,
        "date": booking.date.strftime("%Y-%m-%d"),
        "start_time": booking.start_time.strftime("%H:%M"),
        "end_time": booking.end_time.strftime("%H:%M"),
        "reason": booking.reason,
    }
