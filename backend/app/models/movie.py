from datetime import date

from sqlalchemy import Boolean, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(180), nullable=False, unique=True, index=True)
    genre: Mapped[str] = mapped_column(String(120), nullable=False)
    rating: Mapped[str] = mapped_column(String(20), nullable=False)
    duration_min: Mapped[int] = mapped_column(Integer, nullable=False)
    release_date: Mapped[date] = mapped_column(Date, nullable=False)
    poster_url: Mapped[str] = mapped_column(Text, nullable=False)
    backdrop_url: Mapped[str] = mapped_column(Text, nullable=False)
    trailer_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    synopsis: Mapped[str] = mapped_column(Text, nullable=False)
    cast: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    showtimes = relationship("Showtime", back_populates="movie", cascade="all, delete-orphan")
