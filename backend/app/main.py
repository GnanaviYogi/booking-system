from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ FIRST → import Base & DB
from app.db.base import Base
from app.db.database import engine, SessionLocal

# ✅ SECOND → IMPORT ALL MODELS (VERY IMPORTANT)
from app.models.user import User
from app.models.booking import Booking
from app.models.room import Room

from app.api import room as room_api
from app.api import booking as booking_api

from app.api.user import router as user_router
from app.core import config

# ✅ FOURTH → CREATE TABLES
Base.metadata.create_all(bind=engine)

# ✅ FIFTH → create app
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Seed rooms
def seed_rooms():
    db = SessionLocal()

    rooms = [
        {"name": "Ganga", "capacity": 5},
        {"name": "Yamuna", "capacity": 10},
        {"name": "Kaveri", "capacity": 15},
        {"name": "Narmada", "capacity": 20},
        {"name": "Saraswathi", "capacity": 25},
    ]

    for r in rooms:
        existing = db.query(Room).filter(Room.name == r["name"]).first()

        if not existing:
            db.add(Room(name=r["name"], capacity=r["capacity"]))

    db.commit()
    db.close()


@app.on_event("startup")
def startup_event():
    seed_rooms()


@app.get("/")
def root():
    return {"message": "Meeting Room Booking API running "}


app.include_router(room_api.router)
app.include_router(booking_api.router)
app.include_router(user_router)


from app.core.redis_client import redis_client  # import this


@app.get("/test-redis")
def test_redis():
    try:
        redis_client.set("ping", "pong")
        return {"redis": redis_client.get("ping")}
    except Exception as e:
        return {"error": str(e)}
