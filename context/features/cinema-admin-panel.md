# Cinema Admin Panel

## Overview
A comprehensive management interface for cinema managers and system admins. Covers the full operational lifecycle — from configuring theaters and scheduling movies, to monitoring ticket sales and revenue performance. Only accessible to users with `ADMIN` role.

## Requirement
- **Movies CRUD:** Create, read, update, and delete movies (title, description, poster, trailer URL, duration, release date).
- **Cinemas & Rooms CRUD:** Manage cinema locations and their theater rooms, including configuring the `seatMap` JSON layout per room.
- **Showtime Scheduling:** Assign a movie to a room at a specific date/time; set ticket price and format (2D/3D/IMAX). Prevent scheduling conflicts (overlapping showtimes in the same room).
- **Dashboard:**
  - Total revenue (daily / weekly / monthly).
  - Tickets sold per movie and per showtime.
  - Occupancy rate per room.
- All admin routes are protected by `ADMIN` role check via JWT middleware.
- Backend endpoints:
  - `POST/PUT/DELETE /admin/movies`
  - `POST/PUT/DELETE /admin/cinemas`, `/admin/rooms`
  - `POST/PUT/DELETE /admin/showtimes`
  - `GET /admin/dashboard`

## Reference
Extracted from CineFast Core Features - Section D. Directly manipulates the `Movie`, `Cinema`, `Room`, and `Showtime` models in PostgreSQL. Dashboard data aggregates from the `Booking` table. Depends on User Authentication for role-based access control.
