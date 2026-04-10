# QR Code Scanner (Staff)

## Overview
A dedicated UI for cinema staff (Ticket Checkers) to validate customer tickets at the theater entrance by scanning QR codes. Marks tickets as used to prevent re-entry with the same ticket.

## Requirement
- Camera-based QR code scanning via browser (using device camera).
- On successful scan, call the backend to validate the ticket:
  - Check booking status is `PAID`.
  - Check ticket has not already been scanned/used.
  - Mark the booking as `USED` after first scan.
- Display clear visual/audio feedback:
  - Green + success message for valid ticket.
  - Red + error message for invalid, expired, or already-used ticket.
- Only accessible to users with `STAFF` or `ADMIN` role.

## Reference
Extracted from CineFast Roadmap Phase 2 and Ticket Checker persona. Depends on QR codes generated in the Booking & Payment feature and the User Authentication role system.
