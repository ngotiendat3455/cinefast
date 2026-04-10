# Loyalty Point System

## Overview
Rewards returning customers with points for every booking, which can be redeemed for discounts on future purchases. Encourages repeat usage and customer retention.

## Requirement
- Customers earn points for every completed (PAID) booking (e.g., 1 point per $1 spent).
- Points balance is visible on the user's profile page.
- During checkout, customers can choose to redeem available points for a discount.
- Point redemption is applied before final payment calculation.
- Points history log: show earned and spent transactions.
- Integrate with Premium Subscription: subscribers may earn bonus points (e.g., 2x multiplier).

## Reference
Extracted from CineFast Roadmap Phase 3 Enhancements and Monetization model (Premium Subscriptions). Requires adding a `LoyaltyPoints` and `PointTransaction` model to the database schema.
