# USVI Historic Explorer

USVI Historic Explorer is a simple React application that lists historic sites in the United States Virgin Islands. The project uses [Vite](https://vitejs.dev/) for development and bundling. The app now includes a historic map view and a ride sharing utility.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend API server (required for AI + Stripe flows):
   ```bash
   npm run start:api
   ```
   The API listens on [http://localhost:8787](http://localhost:8787) by default.
3. In a second terminal, start the frontend development server:
   ```bash
   npm start
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).
4. Run tests:
   ```bash
   npm test
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

To deploy the app to Firebase Hosting for the `vigilant-memory` project:

```bash
npm run deploy
```

The command builds the app and uploads the contents of the `dist` directory to Firebase.

## Environment

To enable Stripe payments in the frontend, set `VITE_STRIPE_PUBLISHABLE_KEY` with your Stripe publishable key.

### Required server environment variables

- `OPENAI_API_KEY` for tour guide responses.
- `STRIPE_SECRET_KEY` for PaymentIntent creation.
- `STRIPE_WEBHOOK_SECRET` for webhook signature verification.
- Optional: `TOUR_GUIDE_MODEL`, `CHAT_RATE_LIMIT_MAX`, `CHAT_RATE_LIMIT_WINDOW_MS`.

## Planning

See `IMPLEMENTATION_BACKLOG.md` for the ranked P0/P1/P2 implementation plan with concrete epics, API contracts, and schema.

## Production Readiness

See `PRODUCTION_READINESS.md` for the launch-hardening checklist and phased rollout plan.

## Contact
For questions or feedback please reach out to the project maintainers.
