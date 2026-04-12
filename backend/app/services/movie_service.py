from datetime import date

from sqlalchemy import cast, select
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.sql.sqltypes import Date

from app.models.cinema import Cinema
from app.models.movie import Movie
from app.models.room import Room
from app.models.showtime import Showtime
from app.schemas.movie import (
    MovieDetail,
    MovieListItem,
    MovieShowtimeGroup,
    ShowtimeCinema,
    ShowtimeItem,
    ShowtimeRoom,
)
from fastapi import HTTPException, status


def list_movies(db: Session, status_filter: str | None = None) -> list[MovieListItem]:
    query = select(Movie).order_by(Movie.is_featured.desc(), Movie.release_date.desc(), Movie.title)
    if status_filter:
        query = query.where(Movie.status == status_filter.upper())

    movies = db.scalars(query).all()
    return [MovieListItem.model_validate(movie) for movie in movies]


def get_movie_detail(db: Session, movie_id: int) -> MovieDetail:
    movie = db.execute(
        select(Movie).options(joinedload(Movie.showtimes)).where(Movie.id == movie_id)
    )
    movie = movie.unique().scalar_one_or_none()
    if not movie:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    formats = sorted({showtime.format for showtime in movie.showtimes})
    return MovieDetail(
        id=movie.id,
        title=movie.title,
        slug=movie.slug,
        genre=movie.genre,
        rating=movie.rating,
        duration_min=movie.duration_min,
        release_date=movie.release_date,
        poster_url=movie.poster_url,
        backdrop_url=movie.backdrop_url,
        status=movie.status,
        is_featured=movie.is_featured,
        trailer_url=movie.trailer_url,
        synopsis=movie.synopsis,
        cast=movie.cast,
        formats=formats,
    )


def list_movie_showtimes(
    db: Session,
    movie_id: int,
    show_date: date | None = None,
    location: str | None = None,
    format_filter: str | None = None,
) -> list[MovieShowtimeGroup]:
    movie_exists = db.get(Movie, movie_id)
    if not movie_exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    query = (
        select(Showtime)
        .options(
            joinedload(Showtime.room).joinedload(Room.cinema),
        )
        .where(Showtime.movie_id == movie_id)
        .order_by(Showtime.start_time)
    )

    if show_date:
        query = query.where(cast(Showtime.start_time, Date) == show_date)
    if format_filter:
        query = query.where(Showtime.format == format_filter.upper())
    if location:
        query = query.join(Showtime.room).join(Room.cinema).where(
            Cinema.location.ilike(f"%{location}%")
        )

    showtimes = db.scalars(query).unique().all()

    if location:
        normalized_location = location.lower()
        showtimes = [
            showtime
            for showtime in showtimes
            if normalized_location in showtime.room.cinema.location.lower()
        ]

    grouped: dict[date, list[ShowtimeItem]] = {}
    for showtime in showtimes:
        showtime_date = showtime.start_time.date()
        grouped.setdefault(showtime_date, []).append(
            ShowtimeItem(
                id=showtime.id,
                start_time=showtime.start_time,
                end_time=showtime.end_time,
                format=showtime.format,
                language=showtime.language,
                price=showtime.price,
                cinema=ShowtimeCinema.model_validate(showtime.room.cinema),
                room=ShowtimeRoom.model_validate(showtime.room),
            )
        )

    return [
        MovieShowtimeGroup(date=group_date, items=items)
        for group_date, items in grouped.items()
    ]
