from pydantic import BaseModel, Field
from typing import Optional
from datetime import time, date as Datetype


# ============================
# ✅ CREATE SCHEMA
# ============================
class BookingCreate(BaseModel):
    user_name: str
    room_name: str
    required_capacity: int  # ✅ REQUIRED

    date: Datetype

    start_time: time = Field(..., example="14:30", description="Time in HH:MM format")
    end_time: time = Field(..., example="15:30", description="Time in HH:MM format")

    reason: Optional[str] = None


# ============================
# ✅ RESPONSE SCHEMA
# ============================
class BookingResponse(BaseModel):
    id: int
    user_name: Optional[str] = None
    room_name: Optional[str] = None
    required_capacity: Optional[int] = None  # ✅ ADDED

    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    reason: Optional[str] = None


# ============================
# ✅ UPDATE SCHEMA
# ============================
class BookingUpdate(BaseModel):
    user_name: Optional[str] = None

    room_name: Optional[str] = None  # ✅ ADDED
    required_capacity: Optional[int] = None  # ✅ ADDED

    date: Optional[Datetype] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    reason: Optional[str] = None

    class Config:
        from_attributes = True
