from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_db_session
from app.schemas.seat import SeatAvailabilityResponse, SeatLockRequest, SeatReleaseRequest
from app.services.seat_service import acquire_seat_locks, get_showtime_seats, release_seat_locks

router = APIRouter(tags=["seats"])


@router.get("/showtimes/{showtime_id}/seats", response_model=SeatAvailabilityResponse)
def get_seats(showtime_id: int, session_id: str, db: Session = Depends(get_db_session)):
    return get_showtime_seats(db, showtime_id, session_id)


@router.post("/seats/lock", response_model=SeatAvailabilityResponse)
def lock(data: SeatLockRequest, db: Session = Depends(get_db_session)):
    return acquire_seat_locks(db, data)


@router.delete("/seats/lock", response_model=SeatAvailabilityResponse)
def unlock(data: SeatReleaseRequest, db: Session = Depends(get_db_session)):
    return release_seat_locks(db, data)
