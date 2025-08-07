# USVI Historic Explorer

USVI Historic Explorer is a simple React application that lists historic sites in the United States Virgin Islands. The project uses [Vite](https://vitejs.dev/) for development and bundling. The app now includes a historic map view and a ride sharing utility.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   The script uses `cross-env` so it works on Windows, macOS and Linux. The app will be available at [http://localhost:3000](http://localhost:3000).
3. Run tests:
   ```bash
   npm test
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Environment

To enable Stripe payments, set `VITE_STRIPE_PUBLISHABLE_KEY` with your Stripe publishable key.
The Stripe checkout uses a publishable key provided via `VITE_STRIPE_PUBLIC_KEY`.


## Contact
For questions or feedback please reach out to the project maintainers.
