from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from threading import Lock

from app.core.config import settings

try:
    from redis import Redis
    from redis.exceptions import RedisError
except ImportError:  # pragma: no cover - optional until Redis is installed locally
    Redis = None

    class RedisError(Exception):
        pass


@dataclass
class SeatLock:
    session_id: str
    expires_at: datetime


class InMemorySeatLockStore:
    def __init__(self) -> None:
        self._locks: dict[str, SeatLock] = {}
        self._mutex = Lock()

    def get_locks(self, showtime_id: int) -> dict[str, SeatLock]:
        with self._mutex:
            return self._collect_locks(showtime_id)

    def acquire(self, showtime_id: int, seat_labels: list[str], session_id: str, ttl_seconds: int) -> None:
        prefix = f"seat-lock:{showtime_id}:"
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(seconds=ttl_seconds)

        with self._mutex:
            self._collect_locks(showtime_id)
            for seat_label in seat_labels:
                key = f"{prefix}{seat_label}"
                existing = self._locks.get(key)
                if existing and existing.session_id != session_id:
                    raise SeatLockConflictError(seat_label)

            for seat_label in seat_labels:
                self._locks[f"{prefix}{seat_label}"] = SeatLock(
                    session_id=session_id,
                    expires_at=expires_at,
                )

    def release(self, showtime_id: int, seat_labels: list[str], session_id: str) -> None:
        prefix = f"seat-lock:{showtime_id}:"
        with self._mutex:
            for seat_label in seat_labels:
                key = f"{prefix}{seat_label}"
                existing = self._locks.get(key)
                if existing and existing.session_id == session_id:
                    self._locks.pop(key, None)

    def _collect_locks(self, showtime_id: int) -> dict[str, SeatLock]:
        prefix = f"seat-lock:{showtime_id}:"
        now = datetime.now(timezone.utc)
        expired_keys = [
            key for key, lock in self._locks.items() if key.startswith(prefix) and lock.expires_at <= now
        ]
        for key in expired_keys:
            self._locks.pop(key, None)

        return {
            key.removeprefix(prefix): lock
            for key, lock in self._locks.items()
            if key.startswith(prefix)
        }


class RedisSeatLockStore:
    def __init__(self, redis_url: str) -> None:
        if Redis is None:
            raise SeatLockStoreUnavailableError
        self._client = Redis.from_url(redis_url, decode_responses=True)

    def get_locks(self, showtime_id: int) -> dict[str, SeatLock]:
        prefix = f"seat-lock:{showtime_id}:"
        locks: dict[str, SeatLock] = {}
        try:
            for key in self._client.scan_iter(match=f"{prefix}*"):
                session_id = self._client.get(key)
                ttl_seconds = self._client.ttl(key)
                if not session_id or ttl_seconds <= 0:
                    continue

                seat_label = key.removeprefix(prefix)
                locks[seat_label] = SeatLock(
                    session_id=session_id,
                    expires_at=datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds),
                )
        except RedisError as exc:
            raise SeatLockStoreUnavailableError from exc
        return locks

    def acquire(self, showtime_id: int, seat_labels: list[str], session_id: str, ttl_seconds: int) -> None:
        acquired_now: list[str] = []
        prefix = f"seat-lock:{showtime_id}:"

        try:
            for seat_label in seat_labels:
                key = f"{prefix}{seat_label}"
                existing = self._client.get(key)
                if existing:
                    if existing != session_id:
                        raise SeatLockConflictError(seat_label)
                    self._client.expire(key, ttl_seconds)
                    continue

                acquired = self._client.set(key, session_id, ex=ttl_seconds, nx=True)
                if not acquired:
                    raise SeatLockConflictError(seat_label)
                acquired_now.append(seat_label)
        except SeatLockConflictError:
            self.release(showtime_id, acquired_now, session_id)
            raise
        except RedisError as exc:
            self.release(showtime_id, acquired_now, session_id)
            raise SeatLockStoreUnavailableError from exc

    def release(self, showtime_id: int, seat_labels: list[str], session_id: str) -> None:
        prefix = f"seat-lock:{showtime_id}:"
        for seat_label in seat_labels:
            key = f"{prefix}{seat_label}"
            existing = self._client.get(key)
            if existing == session_id:
                self._client.delete(key)


class SeatLockConflictError(Exception):
    def __init__(self, seat_label: str) -> None:
        self.seat_label = seat_label
        super().__init__(seat_label)


class SeatLockStoreUnavailableError(Exception):
    pass


_in_memory_store = InMemorySeatLockStore()


def _resolve_store():
    if settings.REDIS_URL:
        return RedisSeatLockStore(settings.REDIS_URL)
    return _in_memory_store


def get_seat_locks(showtime_id: int) -> dict[str, SeatLock]:
    return _resolve_store().get_locks(showtime_id)


def lock_seats(showtime_id: int, seat_labels: list[str], session_id: str) -> None:
    _resolve_store().acquire(
        showtime_id=showtime_id,
        seat_labels=seat_labels,
        session_id=session_id,
        ttl_seconds=settings.SEAT_LOCK_TTL_SECONDS,
    )


def release_seats(showtime_id: int, seat_labels: list[str], session_id: str) -> None:
    _resolve_store().release(showtime_id=showtime_id, seat_labels=seat_labels, session_id=session_id)
