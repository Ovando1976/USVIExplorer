export function getStripePublishableKey() {
  return (
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_STRIPE_PUBLIC_KEY ||
    ''
  );
}
