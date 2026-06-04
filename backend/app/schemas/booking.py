from pydantic import BaseModel, Field
from typing import Optional
from datetime import time, date as Datetype


# Request
class BookingCreate(BaseModel):
    user_name: str
    room_name: str
    required_capacity: int

    date: Datetype

    start_time: time = Field(
        ..., example="14:30", description="Time in 24-hour format (HH:MM)"
    )

    end_time: time = Field(
        ..., example="15:30", description="Time in 24-hour format (HH:MM)"
    )

    reason: Optional[str] = None


# Response
class BookingResponse(BaseModel):
    id: int
    user_name: Optional[str] = None
    room_name: Optional[str] = None
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    reason: Optional[str] = None


# Update
class BookingUpdate(BaseModel):
    user_name: Optional[str] = None
    date: Optional[Datetype] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    reason: Optional[str] = None

    class Config:
        from_attributes = True
