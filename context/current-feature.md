# Current Feature

<!-- Feature Name -->

Interactive Seat Selection

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Visual grid representation of the theater layout based on the room's `seatMap` JSON config.
- Color-coded seat states: Available, Selected, Locked, and Sold.
- Real-time seat locking via `POST /seats/lock` with a Redis key and 5-minute TTL.
- If a seat is already locked or sold, return `409 Conflict` and show "Seat Unavailable".
- A 5-minute countdown timer is displayed while the user holds their selected seats.
- When the timer expires or the user navigates away, the lock is released via `DELETE /seats/lock`.
- Floating action bar at the bottom shows total price and a "Proceed to Checkout" button.
- Supports pinch-to-zoom on mobile for large theater layouts.
- Backend endpoints: `GET /showtimes/{id}/seats`, `POST /seats/lock`, `DELETE /seats/lock`.

## Notes

<!-- Any extra notes -->

Allows users to visually select seats from the theater layout while preventing seat stealing through temporary Redis-based locks. Redis is critical here because locks must live outside SQL and expire automatically. This feature feeds directly into the Booking & Payment checkout flow.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-06: Set current feature to `Policy and Gate Baseline` and marked status as `In Progress`.
- 2026-04-06: Replaced placeholder notes with the matching Stripe phase 2 policy and gating baseline requirements from available context files.
- 2026-04-06: Marked the current feature as `Completed` and cleared the active feature name, goals, and notes block.
- 2026-04-10: Set current feature to `User Authentication & Profile` and marked status as `In Progress`.
- 2026-04-12: Marked `User Authentication & Profile` as `Completed`.
- 2026-04-12: Set current feature to `Movie & Showtime Discovery` and marked status as `In Progress`.
- 2026-04-12: Marked `Movie & Showtime Discovery` as `Completed`.
- 2026-04-12: Set current feature to `Interactive Seat Selection` and marked status as `In Progress`.
- 2026-04-13: Marked `Interactive Seat Selection` as `Completed`.
