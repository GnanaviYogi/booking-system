from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.booking import Booking
from app.models.room import Room
from app.models.user import User


# ============================
# ✅ CREATE BOOKING
# ============================
def create_booking_service(db: Session, data):

    room = db.query(Room).filter(Room.name.ilike(data.room_name.strip())).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    user = db.query(User).filter(User.name.ilike(data.user_name.strip())).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ LIMIT CHECK
    existing_count = (
        db.query(Booking)
        .filter(Booking.user_id == user.id, Booking.date == data.date)
        .count()
    )

    if existing_count >= 3:
        raise HTTPException(
            status_code=400,
            detail="You cannot book more than 3 rooms in a day",
        )

    # ✅ CAPACITY CHECK
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

    # ✅ TIME VALIDATION
    if data.end_time <= data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # ✅ OVERLAP CHECK
    overlapping = (
        db.query(Booking)
        .filter(
            Booking.room_id == room.id,
            Booking.date == data.date,
            Booking.start_time < data.end_time,
            Booking.end_time > data.start_time,
        )
        .first()
    )

    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="Room already booked for this time slot",
        )

    # ✅ CREATE BOOKING
    booking = Booking(
        user_id=user.id,
        user_name=user.name,
        room_id=room.id,
        required_capacity=data.required_capacity,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        reason=data.reason,
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "user_name": booking.user_name,
        "room_name": room.name,
        "required_capacity": booking.required_capacity,
        "date": booking.date.strftime("%Y-%m-%d"),
        "start_time": booking.start_time.strftime("%H:%M"),
        "end_time": booking.end_time.strftime("%H:%M"),
        "reason": booking.reason,
    }


# ============================
# ✅ GET BOOKINGS (✅ FIXED)
# ============================
def get_bookings_service(
    db: Session,
    user_name: str = None,
    room_name: str = None,
    date: str = None,
    reason: str = None,
):

    query = db.query(Booking)

    # ✅ USER FILTER (optional)
    if user_name:
        query = query.filter(Booking.user_name.ilike(f"%{user_name.strip()}%"))

    # ✅ REASON FILTER (optional)
    if reason:
        query = query.filter(Booking.reason == reason)

    # ✅ ROOM FILTER (optional)
    if room_name:
        room = db.query(Room).filter(Room.name.ilike(room_name.strip())).first()

        if room:
            query = query.filter(Booking.room_id == room.id)
        else:
            return []  # no room → no results

    # ✅ DATE FILTER (optional)
    if date:
        query = query.filter(Booking.date == date)

    bookings = query.all()

    return [
        {
            "id": b.id,
            "user_name": b.user_name,
            "room_name": b.room.name if b.room else "Unknown Room",
            "required_capacity": b.required_capacity,
            "date": b.date.strftime("%Y-%m-%d") if b.date else None,
            "start_time": b.start_time.strftime("%H:%M") if b.start_time else None,
            "end_time": b.end_time.strftime("%H:%M") if b.end_time else None,
            "reason": b.reason,
        }
        for b in bookings
    ]


# ============================
# ✅ DELETE BOOKING
# ============================
def delete_booking_service(db: Session, booking_id: int):

    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    db.delete(booking)
    db.commit()

    return {"message": "Booking deleted successfully"}


# ============================
# ✅ UPDATE BOOKING
# ============================
def update_booking_service(db: Session, booking_id: int, data):

    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # ✅ USER
    if data.user_name:
        user = db.query(User).filter(User.name.ilike(data.user_name.strip())).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        booking.user_id = user.id
        booking.user_name = user.name

    # ✅ ROOM
    if hasattr(data, "room_name") and data.room_name:
        room = db.query(Room).filter(Room.name.ilike(data.room_name.strip())).first()

        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        booking.room_id = room.id

    # ✅ DATE & TIME
    if data.date:
        booking.date = data.date

    if hasattr(data, "start_time") and data.start_time:
        booking.start_time = data.start_time

    if hasattr(data, "end_time") and data.end_time:
        booking.end_time = data.end_time

    # ✅ REASON
    if data.reason is not None:
        booking.reason = data.reason

    # ✅ CAPACITY
    if hasattr(data, "required_capacity") and data.required_capacity:
        room = db.query(Room).filter(Room.id == booking.room_id).first()

        if data.required_capacity > room.capacity:
            raise HTTPException(
                status_code=400,
                detail="Selected room does not support required capacity",
            )

        booking.required_capacity = data.required_capacity

    # ✅ TIME VALIDATION
    if booking.end_time <= booking.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # ✅ OVERLAP CHECK
    overlapping = (
        db.query(Booking)
        .filter(
            Booking.room_id == booking.room_id,
            Booking.date == booking.date,
            Booking.id != booking.id,
            Booking.start_time < booking.end_time,
            Booking.end_time > booking.start_time,
        )
        .first()
    )

    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="Room already booked for this time slot",
        )

    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "user_name": booking.user_name,
        "room_name": booking.room.name,
        "required_capacity": booking.required_capacity,
        "date": booking.date.strftime("%Y-%m-%d"),
        "start_time": booking.start_time.strftime("%H:%M"),
        "end_time": booking.end_time.strftime("%H:%M"),
        "reason": booking.reason,
    }


from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.booking import Booking
from app.models.room import Room
from app.models.user import User


# ============================
# ✅ CREATE BOOKING
# ============================
def create_booking_service(db: Session, data):

    room = db.query(Room).filter(Room.name.ilike(data.room_name.strip())).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    user = db.query(User).filter(User.name.ilike(data.user_name.strip())).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ LIMIT CHECK
    existing_count = (
        db.query(Booking)
        .filter(Booking.user_id == user.id, Booking.date == data.date)
        .count()
    )

    if existing_count >= 3:
        raise HTTPException(
            status_code=400,
            detail="You cannot book more than 3 rooms in a day",
        )

    # ✅ CAPACITY CHECK
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

    # ✅ TIME VALIDATION
    if data.end_time <= data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # ✅ OVERLAP CHECK
    overlapping = (
        db.query(Booking)
        .filter(
            Booking.room_id == room.id,
            Booking.date == data.date,
            Booking.start_time < data.end_time,
            Booking.end_time > data.start_time,
        )
        .first()
    )

    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="Room already booked for this time slot",
        )

    # ✅ CREATE BOOKING
    booking = Booking(
        user_id=user.id,
        user_name=user.name,
        room_id=room.id,
        required_capacity=data.required_capacity,
        date=data.date,
        start_time=data.start_time,
        end_time=data.end_time,
        reason=data.reason,
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "user_name": booking.user_name,
        "room_name": room.name,
        "required_capacity": booking.required_capacity,
        "date": booking.date.strftime("%Y-%m-%d"),
        "start_time": booking.start_time.strftime("%H:%M"),
        "end_time": booking.end_time.strftime("%H:%M"),
        "reason": booking.reason,
    }


# ============================
# ✅ GET BOOKINGS (✅ FIXED)
# ============================
def get_bookings_service(
    db: Session,
    user_name: str = None,
    room_name: str = None,
    date: str = None,
    reason: str = None,
):

    query = db.query(Booking)

    # ✅ USER FILTER (optional)
    if user_name:
        query = query.filter(Booking.user_name.ilike(f"%{user_name.strip()}%"))

    # ✅ REASON FILTER (optional)
    if reason:
        query = query.filter(Booking.reason == reason)

    # ✅ ROOM FILTER (optional)
    if room_name:
        room = db.query(Room).filter(Room.name.ilike(room_name.strip())).first()

        if room:
            query = query.filter(Booking.room_id == room.id)
        else:
            return []  # no room → no results

    # ✅ DATE FILTER (optional)
    if date:
        query = query.filter(Booking.date == date)

    bookings = query.all()

    return [
        {
            "id": b.id,
            "user_name": b.user_name,
            "room_name": b.room.name if b.room else "Unknown Room",
            "required_capacity": b.required_capacity,
            "date": b.date.strftime("%Y-%m-%d") if b.date else None,
            "start_time": b.start_time.strftime("%H:%M") if b.start_time else None,
            "end_time": b.end_time.strftime("%H:%M") if b.end_time else None,
            "reason": b.reason,
        }
        for b in bookings
    ]


# ============================
# ✅ DELETE BOOKING
# ============================
def delete_booking_service(db: Session, booking_id: int):

    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    db.delete(booking)
    db.commit()

    return {"message": "Booking deleted successfully"}


# ============================
# ✅ UPDATE BOOKING
# ============================
def update_booking_service(db: Session, booking_id: int, data):

    booking = db.query(Booking).filter(Booking.id == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # ✅ USER
    if data.user_name:
        user = db.query(User).filter(User.name.ilike(data.user_name.strip())).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        booking.user_id = user.id
        booking.user_name = user.name

    # ✅ ROOM
    if hasattr(data, "room_name") and data.room_name:
        room = db.query(Room).filter(Room.name.ilike(data.room_name.strip())).first()

        if not room:
            raise HTTPException(status_code=404, detail="Room not found")

        booking.room_id = room.id

    # ✅ DATE & TIME
    if data.date:
        booking.date = data.date

    if hasattr(data, "start_time") and data.start_time:
        booking.start_time = data.start_time

    if hasattr(data, "end_time") and data.end_time:
        booking.end_time = data.end_time

    # ✅ REASON
    if data.reason is not None:
        booking.reason = data.reason

    # ✅ CAPACITY
    if hasattr(data, "required_capacity") and data.required_capacity:
        room = db.query(Room).filter(Room.id == booking.room_id).first()

        if data.required_capacity > room.capacity:
            raise HTTPException(
                status_code=400,
                detail="Selected room does not support required capacity",
            )

        booking.required_capacity = data.required_capacity

    # ✅ TIME VALIDATION
    if booking.end_time <= booking.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    # ✅ OVERLAP CHECK
    overlapping = (
        db.query(Booking)
        .filter(
            Booking.room_id == booking.room_id,
            Booking.date == booking.date,
            Booking.id != booking.id,
            Booking.start_time < booking.end_time,
            Booking.end_time > booking.start_time,
        )
        .first()
    )

    if overlapping:
        raise HTTPException(
            status_code=400,
            detail="Room already booked for this time slot",
        )

    db.commit()
    db.refresh(booking)

    return {
        "id": booking.id,
        "user_name": booking.user_name,
        "room_name": booking.room.name,
        "required_capacity": booking.required_capacity,
        "date": booking.date.strftime("%Y-%m-%d"),
        "start_time": booking.start_time.strftime("%H:%M"),
        "end_time": booking.end_time.strftime("%H:%M"),
        "reason": booking.reason,
    }
