from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class MovieListItem(BaseModel):
    id: int
    title: str
    slug: str
    genre: str
    rating: str
    duration_min: int
    release_date: date
    poster_url: str
    backdrop_url: str
    status: str
    is_featured: bool

    model_config = {"from_attributes": True}


class MovieDetail(MovieListItem):
    trailer_url: str | None
    synopsis: str
    cast: str
    formats: list[str]


class ShowtimeCinema(BaseModel):
    id: int
    name: str
    location: str

    model_config = {"from_attributes": True}


class ShowtimeRoom(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class ShowtimeItem(BaseModel):
    id: int
    start_time: datetime
    end_time: datetime
    format: str
    language: str
    price: Decimal
    cinema: ShowtimeCinema
    room: ShowtimeRoom


class MovieShowtimeGroup(BaseModel):
    date: date
    items: list[ShowtimeItem]
