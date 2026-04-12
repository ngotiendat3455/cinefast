# Current Feature

<!-- Feature Name -->

Movie & Showtime Discovery

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Home page displays two sections: "Now Showing" and "Coming Soon" as a movie grid.
- Hero carousel at the top highlights featured or trending movies.
- Each movie card shows: poster, title, genre, rating, and duration.
- Movie Detail page includes trailer modal, synopsis, cast info, release date, and format.
- A date-picker to browse available showtimes.
- Showtime list filters by: date, cinema location, and format.
- Selecting a showtime navigates the user to the Seat Map.
- Backend endpoints: `GET /movies`, `GET /movies/{id}`, `GET /movies/{id}/showtimes`.

## Notes

<!-- Any extra notes -->

Entry point of the customer journey from browsing movies to choosing a showtime before seat selection. Depends on the `Movie`, `Showtime`, `Cinema`, and `Room` data models, and feeds directly into the Interactive Seat Selection feature.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-06: Set current feature to `Policy and Gate Baseline` and marked status as `In Progress`.
- 2026-04-06: Replaced placeholder notes with the matching Stripe phase 2 policy and gating baseline requirements from available context files.
- 2026-04-06: Marked the current feature as `Completed` and cleared the active feature name, goals, and notes block.
- 2026-04-10: Set current feature to `User Authentication & Profile` and marked status as `In Progress`.
- 2026-04-12: Marked `User Authentication & Profile` as `Completed`.
- 2026-04-12: Set current feature to `Movie & Showtime Discovery` and marked status as `In Progress`.
- 2026-04-12: Marked `Movie & Showtime Discovery` as `Completed`.
