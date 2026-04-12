from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session
from app.schemas.movie import MovieDetail, MovieListItem, MovieShowtimeGroup
from app.services.movie_service import get_movie_detail, list_movie_showtimes, list_movies

router = APIRouter(prefix="/movies", tags=["movies"])


@router.get("", response_model=list[MovieListItem])
def get_movies(
    status: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db_session),
):
    return list_movies(db, status)


@router.get("/{movie_id}", response_model=MovieDetail)
def get_movie(movie_id: int, db: Session = Depends(get_db_session)):
    return get_movie_detail(db, movie_id)


@router.get("/{movie_id}/showtimes", response_model=list[MovieShowtimeGroup])
def get_movie_showtimes(
    movie_id: int,
    date: date | None = None,
    location: str | None = None,
    format: str | None = None,
    db: Session = Depends(get_db_session),
):
    return list_movie_showtimes(db, movie_id, date, location, format)
