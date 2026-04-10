# Combo Booking (Popcorn & Drinks)

## Overview
Allows customers to add food and beverage combos to their order during the checkout flow, increasing average order value and enhancing the cinematic experience.

## Requirement
- Display a list of available combos (e.g., "Large Popcorn + Drink") with prices during checkout.
- Allow adding/removing combos with quantity control.
- Combo items are included in the booking's total price calculation.
- Combos are associated with a specific `Booking` record in the database.
- Admin can manage combo items (CRUD) from the Cinema Admin Panel.

## Reference
Extracted from CineFast Roadmap Phase 3 Enhancements. Adds an `OrderItem` or `Combo` model to the data schema. Integrated into the Booking & Payment checkout flow.
