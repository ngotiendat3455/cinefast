# Movie & Showtime Discovery

## Overview
Provides moviegoers a seamless way to browse movies and view showtimes to make informed decisions when planning a cinema visit. This is the entry point of the customer journey — from the home page to selecting a showtime before proceeding to seat selection.

## Requirement
- Home page displays two sections: "Now Showing" and "Coming Soon" as a movie grid.
- Hero carousel at the top highlights featured or trending movies.
- Each movie card shows: poster, title, genre, rating, and duration.
- Movie Detail page includes:
  - Trailer modal (YouTube embed or direct video).
  - Synopsis, cast info, release date, and format (2D / 3D / IMAX).
  - A date-picker to browse available showtimes.
- Showtime list filters by: date, cinema location, and format (2D, 3D, IMAX).
- Selecting a showtime navigates the user to the Seat Map.
- Backend endpoints: `GET /movies`, `GET /movies/{id}`, `GET /movies/{id}/showtimes`.

## Reference
Extracted from CineFast Core Features - Section A and UI/UX Layout spec. Depends on the `Movie`, `Showtime`, `Cinema`, and `Room` database models. Showtime data feeds directly into the Interactive Seat Selection feature.
