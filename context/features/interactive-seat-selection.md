# Interactive Seat Selection

## Overview
Allows users to visually select their seats in a theater layout. To prevent multiple users from booking the same seat simultaneously ("seat stealing"), the system uses a temporary Redis-based lock during the selection process.

## Requirement
- Visual grid representation of the theater layout based on the room's `seatMap` JSON config.
- Color-coded seat states:
  - **Available** — can be selected.
  - **Selected** — currently chosen by this user (highlighted).
  - **Locked** — temporarily held by another user (unclickable).
  - **Sold** — already booked (unclickable).
- **Real-time Seat Locking:** When a user clicks a seat, the frontend calls `POST /seats/lock`. The backend sets a Redis key with a 5-minute TTL.
- If a seat is already locked or sold, return `409 Conflict` and show "Seat Unavailable".
- A 5-minute countdown timer is displayed while the user holds their selected seats.
- When the timer expires or the user navigates away, the lock is released via `DELETE /seats/lock`.
- Floating action bar at the bottom shows total price and a "Proceed to Checkout" button.
- Supports pinch-to-zoom on mobile for large theater layouts.
- Backend endpoints: `GET /showtimes/{id}/seats`, `POST /seats/lock`, `DELETE /seats/lock`.

## Reference
Extracted from CineFast Core Features - Section B and Booking & Seat Locking Flow diagram. Redis is critical here — all locks are stored in Redis, not the SQL database. Feeds directly into the Booking & Payment checkout flow.
