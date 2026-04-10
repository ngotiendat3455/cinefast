# Current Feature

<!-- Feature Name -->

User Authentication & Profile

## Status

<!-- Not Started|In Progress|Completed -->

In Progress

## Goals

<!-- Goals & requirements -->

- User registration with email and password.
- JWT-based login with access/refresh token flow.
- Role-based access control: `CUSTOMER`, `ADMIN`, `STAFF`.
- Protected routes on the frontend based on user role.
- Profile page: view and update name, email, and password.
- Session persistence across page reloads (stored securely in memory or httpOnly cookie).

## Notes

<!-- Any extra notes -->

Foundation for all other features — Booking, Admin Panel, and QR Scanner all depend on authenticated sessions. References the CineFast User model and Users persona table.

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-04-06: Set current feature to `Policy and Gate Baseline` and marked status as `In Progress`.
- 2026-04-06: Replaced placeholder notes with the matching Stripe phase 2 policy and gating baseline requirements from available context files.
- 2026-04-06: Marked the current feature as `Completed` and cleared the active feature name, goals, and notes block.
- 2026-04-10: Set current feature to `User Authentication & Profile` and marked status as `In Progress`.
