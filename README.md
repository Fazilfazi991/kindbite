# Kindbite

## Checkout Environment

Copy `.env.example` to `.env.local`, add Stripe test keys, and restart the dev server.

Do not commit `.env.local`. Keep `STRIPE_SECRET_KEY` server-side only and rotate any live key that has been shared outside Stripe.
