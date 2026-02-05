import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { getStripePublishableKey } from '../lib/env';

const stripePromise = loadStripe(getStripePublishableKey());

function StripePayment() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default StripePayment;
