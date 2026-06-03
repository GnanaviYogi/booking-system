from pydantic import BaseModel
from datetime import time
from typing import List


class BookingInfo(BaseModel):
    user_name: str
    start_time: time
    end_time: time


class RoomAvailabilityResponse(BaseModel):
    room_name: str
    is_available: bool
    bookings: List[BookingInfo]