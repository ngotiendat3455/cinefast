from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


SeatState = Literal["available", "selected", "locked", "sold"]


class SeatMapConfig(BaseModel):
    rows: list[str]
    seats_per_row: int = Field(gt=0)


class SeatItem(BaseModel):
    label: str
    row: str
    number: int
    state: SeatState


class SeatAvailabilityResponse(BaseModel):
    showtime_id: int
    movie_title: str
    cinema_name: str
    cinema_location: str
    room_name: str
    showtime_start: datetime
    showtime_end: datetime
    format: str
    language: str
    price_per_seat: Decimal
    seat_map: SeatMapConfig
    seats: list[SeatItem]
    selected_seat_labels: list[str]
    countdown_seconds: int
    lock_expires_at: datetime | None


class SeatLockRequest(BaseModel):
    showtime_id: int
    seat_labels: list[str] = Field(min_length=1)
    session_id: str = Field(min_length=8, max_length=120)


class SeatReleaseRequest(BaseModel):
    showtime_id: int
    seat_labels: list[str] = Field(min_length=1)
    session_id: str = Field(min_length=8, max_length=120)
