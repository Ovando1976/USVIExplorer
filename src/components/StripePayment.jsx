import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { getStripePublishableKey } from '../lib/env';

const stripePromise = loadStripe(getStripePublishableKey());

function StripePayment() {
  return (
    <div className="App">
      <section className="page-card donate-card">
        <h2 className="section-title">Support USVI Historic Explorer</h2>
        <p className="donate-subtitle">
          Your donation helps keep historic site data and local guides accessible for everyone.
        </p>
        <ul className="donate-highlights">
          <li>Preserve cultural landmarks and stories.</li>
          <li>Fund new maps, tours, and education resources.</li>
          <li>Support the local heritage community.</li>
        </ul>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </section>
    </div>
  );
}

export default StripePayment;
