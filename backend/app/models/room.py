from sqlalchemy import ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(primary_key=True)
    cinema_id: Mapped[int] = mapped_column(ForeignKey("cinemas.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    seat_map: Mapped[dict] = mapped_column(JSON, nullable=False)

    cinema = relationship("Cinema", back_populates="rooms")
    showtimes = relationship("Showtime", back_populates="room", cascade="all, delete-orphan")
