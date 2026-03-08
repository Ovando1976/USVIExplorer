import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import CheckoutForm from './CheckoutForm';

const stripeMock = {
  createPaymentMethod: vi.fn(async () => ({ error: null }))
};

const elementsMock = {
  getElement: vi.fn(() => ({}))
};

let stripeAvailable = false;

beforeEach(() => {
  stripeAvailable = false;
  stripeMock.createPaymentMethod.mockClear();
  elementsMock.getElement.mockClear();
});

vi.mock('@stripe/react-stripe-js', () => {
  return {
    CardElement: () => <div data-testid="card-element" />,
    useStripe: () => (stripeAvailable ? stripeMock : null),
    useElements: () => (stripeAvailable ? elementsMock : null)
  };
});

test('disables donate button when stripe is unavailable', () => {
  stripeAvailable = false;
  render(<CheckoutForm />);
  const button = screen.getByRole('button', { name: /donate \$/i });
  expect(button).toBeDisabled();
});

test('supports quick amount chips', () => {
  stripeAvailable = false;
  render(<CheckoutForm />);

  fireEvent.click(screen.getByRole('button', { name: '$50' }));

  expect(screen.getByRole('button', { name: /donate \$50/i })).toBeInTheDocument();
});

test('shows validation message when amount is below minimum', async () => {
  stripeAvailable = true;
  render(<CheckoutForm />);

  fireEvent.change(screen.getByRole('spinbutton', { name: /donation amount \(usd\)/i }), {
    target: { value: '1' }
  });
  fireEvent.click(screen.getByRole('button', { name: /donate \$1/i }));

  expect(await screen.findByText(/at least \$5/i)).toBeInTheDocument();
  expect(stripeMock.createPaymentMethod).not.toHaveBeenCalled();
});
