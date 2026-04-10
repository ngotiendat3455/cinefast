# Booking & Payment

## Overview
The final step in the customer's journey — processes the transaction and issues a digital ticket on success. If the user fails to complete payment within the allowed time, the booking is automatically cancelled and locked seats are released.

## Requirement
- Checkout summary page shows: selected seats, showtime details, price breakdown, and total.
- Supported payment gateways: **Stripe** (international), **VNPay** and **Momo** (local Vietnam).
- On initiating payment:
  - A `Booking` record is created in the DB with status `PENDING`.
  - A `paymentIntent` is stored for tracking.
- On payment success:
  - Booking status updated to `PAID`.
  - Redis seat locks are deleted (seats become permanently `Sold`).
  - A unique QR code is generated and stored in the `Booking.qrCode` field.
- On payment failure or timeout:
  - Booking status updated to `CANCELLED`.
  - Redis seat locks are released, making seats available again.
- **Celery background task** auto-cancels `PENDING` bookings older than 10 minutes as a safety net.
- "My Tickets" page: wallet-style view of all upcoming and past tickets with QR codes displayed prominently.
- Backend endpoints: `POST /bookings`, `POST /bookings/{id}/pay`, `GET /bookings/me`.

## Reference
Extracted from CineFast Core Features - Section C and Booking & Seat Locking Flow diagram. Depends on Interactive Seat Selection (locked seats), User Authentication (userId), and Celery task queue for auto-expiry. QR codes generated here are consumed by the QR Code Scanner feature.
