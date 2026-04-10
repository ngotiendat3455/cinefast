# User Authentication & Profile

## Overview
Handles user registration, login, session management, and role-based access control. All three user roles (Customer, Admin, Staff) share the same auth system but are gated to different parts of the application based on their role.

## Requirement
- User registration with email and password.
- JWT-based login with access/refresh token flow.
- Role-based access control: `CUSTOMER`, `ADMIN`, `STAFF`.
- Protected routes on the frontend based on user role.
- Profile page: view and update name, email, and password.
- Session persistence across page reloads (stored securely in memory or httpOnly cookie).

## Reference
Extracted from CineFast Data Model (User model) and Users persona table. Foundation for all other features — Booking, Admin Panel, and QR Scanner all depend on authenticated sessions.
