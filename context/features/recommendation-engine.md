# Recommendation Engine

## Overview
Surfaces personalized movie suggestions to customers based on their viewing history and trending titles, keeping users engaged and helping them discover films they'll enjoy.

## Requirement
- "Because you watched..." section on the Home page and Movie Detail page.
- Recommendations based on:
  - User's past bookings (genre, director, cast).
  - Globally trending movies (most booked in the last 7 days).
- Cold-start fallback for new users: show top-rated or most popular movies.
- Backend endpoint: `GET /movies/recommendations` (authenticated for personalized, public for trending).
- Results are cached in Redis with a reasonable TTL (e.g., 1 hour) to avoid repeated DB queries.

## Reference
Extracted from CineFast Roadmap Phase 3 Enhancements. Reads from `Booking` history and `Movie` metadata. Leverages existing Redis infrastructure for caching results.
