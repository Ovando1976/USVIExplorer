import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import CheckoutForm from './CheckoutForm';

const stripeMock = {
  confirmCardPayment: vi.fn(async () => ({ error: null }))
};

const elementsMock = {
  getElement: vi.fn(() => ({}))
};

let stripeAvailable = false;

beforeEach(() => {
  stripeAvailable = false;
  stripeMock.confirmCardPayment.mockClear();
  elementsMock.getElement.mockClear();
  global.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({ clientSecret: 'pi_123_secret_abc' })
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
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
  expect(stripeMock.confirmCardPayment).not.toHaveBeenCalled();
});

test('creates payment intent and confirms payment on submit', async () => {
  stripeAvailable = true;
  render(<CheckoutForm />);

  fireEvent.click(screen.getByRole('button', { name: /donate \$25/i }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/v1/payments/create-intent', expect.objectContaining({ method: 'POST' }));
  });
  await waitFor(() => {
    expect(stripeMock.confirmCardPayment).toHaveBeenCalledWith('pi_123_secret_abc', expect.any(Object));
  });
  expect(await screen.findByText(/submitted successfully/i)).toBeInTheDocument();
});
