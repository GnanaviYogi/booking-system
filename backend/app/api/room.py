from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.schemas.room import RoomResponse
from app.services.room import get_rooms_service
from app.models.room import Room
from app.models.booking import Booking

router = APIRouter(prefix="/rooms", tags=["Rooms"])


# Get all rooms
@router.get("/", response_model=list[RoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    return get_rooms_service(db)


# Availability API (FINAL CLEAN VERSION)
@router.get("/availability")
def check_availability(
    start_time: str = Query(...),
    end_time: str = Query(...),
    required_capacity: int = Query(..., gt=0, lt=100),
    db: Session = Depends(get_db),
):
    # Force validation (backup safety)
    if required_capacity <= 0 or required_capacity >= 100:
        raise HTTPException(status_code=400, detail="Capacity must be between 1 and 99")

    # Convert time
    try:
        start_time_obj = datetime.strptime(start_time, "%I:%M %p").time()
        end_time_obj = datetime.strptime(end_time, "%I:%M %p").time()
    except:
        raise HTTPException(
            status_code=400, detail="Time must be in HH:MM AM/PM format"
        )

    available_rooms = []

    # Filter rooms based on capacity
    rooms = db.query(Room).filter(Room.capacity >= required_capacity).all()

    for room in rooms:
        overlapping = (
            db.query(Booking)
            .filter(
                Booking.room_id == room.id,
                Booking.start_time < end_time_obj,
                Booking.end_time > start_time_obj,
            )
            .first()
        )

        if not overlapping:
            available_rooms.append(
                {
                    "room_name": room.name,
                    "capacity": room.capacity,
                    "status": "available",
                }
            )

    return {"available_rooms": available_rooms}
