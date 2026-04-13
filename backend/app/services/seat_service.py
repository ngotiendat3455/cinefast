from __future__ import annotations

from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models.room import Room
from app.models.showtime import Showtime
from app.schemas.seat import (
    SeatAvailabilityResponse,
    SeatItem,
    SeatLockRequest,
    SeatMapConfig,
    SeatReleaseRequest,
)
from app.services.seat_lock_service import (
    SeatLockConflictError,
    SeatLockStoreUnavailableError,
    get_seat_locks,
    lock_seats,
    release_seats,
)


def get_showtime_seats(db: Session, showtime_id: int, session_id: str) -> SeatAvailabilityResponse:
    showtime = _get_showtime_with_room(db, showtime_id)
    return _build_seat_availability(showtime, session_id)


def acquire_seat_locks(db: Session, data: SeatLockRequest) -> SeatAvailabilityResponse:
    showtime = _get_showtime_with_room(db, data.showtime_id)
    valid_seat_labels = {seat.label for seat in _generate_seats(showtime.room.seat_map)}
    sold_seats = set(showtime.sold_seats or [])
    current_locks = get_seat_locks(showtime.id)

    _validate_requested_seats(data.seat_labels, valid_seat_labels)
    conflicting_sold = sorted(sold_seats.intersection(data.seat_labels))
    if conflicting_sold:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Seat Unavailable: {', '.join(conflicting_sold)}",
        )

    try:
        seat_labels_to_lock = sorted(
            {
                *data.seat_labels,
                *[
                    seat_label
                    for seat_label, lock in current_locks.items()
                    if lock.session_id == data.session_id
                ],
            }
        )
        lock_seats(showtime.id, seat_labels_to_lock, data.session_id)
    except SeatLockConflictError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Seat Unavailable: {exc.seat_label}",
        ) from exc
    except SeatLockStoreUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Seat lock service is unavailable",
        ) from exc

    return _build_seat_availability(showtime, data.session_id)


def release_seat_locks(db: Session, data: SeatReleaseRequest) -> SeatAvailabilityResponse:
    showtime = _get_showtime_with_room(db, data.showtime_id)
    valid_seat_labels = {seat.label for seat in _generate_seats(showtime.room.seat_map)}
    _validate_requested_seats(data.seat_labels, valid_seat_labels)

    release_seats(showtime.id, data.seat_labels, data.session_id)
    return _build_seat_availability(showtime, data.session_id)


def _get_showtime_with_room(db: Session, showtime_id: int) -> Showtime:
    showtime = db.execute(
        select(Showtime)
        .options(
            joinedload(Showtime.movie),
            joinedload(Showtime.room).joinedload(Room.cinema),
        )
        .where(Showtime.id == showtime_id)
    ).unique().scalar_one_or_none()

    if not showtime:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Showtime not found")
    return showtime


def _build_seat_availability(showtime: Showtime, session_id: str) -> SeatAvailabilityResponse:
    try:
        locks = get_seat_locks(showtime.id)
    except SeatLockStoreUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Seat lock service is unavailable",
        ) from exc
    sold_seats = set(showtime.sold_seats or [])
    seat_map = SeatMapConfig.model_validate(showtime.room.seat_map)
    seats = _generate_seats(showtime.room.seat_map)
    selected_seats: list[str] = []
    selected_expirations: list[datetime] = []

    seat_items: list[SeatItem] = []
    for seat in seats:
        lock = locks.get(seat.label)
        state = "available"
        if seat.label in sold_seats:
            state = "sold"
        elif lock and lock.session_id == session_id:
            state = "selected"
            selected_seats.append(seat.label)
            selected_expirations.append(lock.expires_at)
        elif lock:
            state = "locked"

        seat_items.append(
            SeatItem(
                label=seat.label,
                row=seat.row,
                number=seat.number,
                state=state,
            )
        )

    lock_expires_at = max(selected_expirations) if selected_expirations else None
    countdown_seconds = 0
    if lock_expires_at:
        countdown_seconds = max(
            0,
            int((lock_expires_at - datetime.now(timezone.utc)).total_seconds()),
        )

    return SeatAvailabilityResponse(
        showtime_id=showtime.id,
        movie_title=showtime.movie.title,
        cinema_name=showtime.room.cinema.name,
        cinema_location=showtime.room.cinema.location,
        room_name=showtime.room.name,
        showtime_start=showtime.start_time,
        showtime_end=showtime.end_time,
        format=showtime.format,
        language=showtime.language,
        price_per_seat=showtime.price,
        seat_map=seat_map,
        seats=seat_items,
        selected_seat_labels=selected_seats,
        countdown_seconds=countdown_seconds,
        lock_expires_at=lock_expires_at,
    )


def _validate_requested_seats(seat_labels: list[str], valid_seat_labels: set[str]) -> None:
    invalid_seat_labels = [seat_label for seat_label in seat_labels if seat_label not in valid_seat_labels]
    if invalid_seat_labels:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown seat label: {', '.join(invalid_seat_labels)}",
        )


def _generate_seats(seat_map: dict) -> list[SeatItem]:
    rows = seat_map.get("rows", [])
    seats_per_row = int(seat_map.get("seats_per_row", 0))

    seats: list[SeatItem] = []
    for row in rows:
        for number in range(1, seats_per_row + 1):
            seats.append(
                SeatItem(
                    label=f"{row}{number}",
                    row=row,
                    number=number,
                    state="available",
                )
            )
    return seats
