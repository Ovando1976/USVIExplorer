import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {vi} from 'vitest';
import CheckoutForm from './CheckoutForm';

vi.mock('@stripe/react-stripe-js', () => {
  return {
    CardElement: () => <div data-testid="card-element" />,
    useStripe: () => null,
    useElements: () => null,
  };
});

test('disables pay button when stripe is unavailable', () => {
  render(<CheckoutForm />);
  const button = screen.getByRole('button', {name: /pay/i});
  expect(button).toBeDisabled();
});
