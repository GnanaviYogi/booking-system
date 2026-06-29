from pydantic import BaseModel, validator
from typing import Optional


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    capacity: Optional[int] = None


# Response Schema (for GET/POST response)
class RoomResponse(BaseModel):
    id: int
    name: str
    capacity: int

    class Config:
        from_attributes = True


class RoomCreate(BaseModel):
    name: str
    capacity: int

    @validator("capacity")
    def validate_capacity(cls, value):
        if value <= 0 or value >= 100:
            raise ValueError("Capacity must be between 1 and 99")
        return value
