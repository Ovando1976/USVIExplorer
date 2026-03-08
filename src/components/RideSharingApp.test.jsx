import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import RideSharingApp from './RideSharingApp';

vi.mock('./RoutePreviewMap', () => ({
  default: () => <div data-testid="route-preview-map" />
}));

test('shows airport surge pricing when pickup is STT airport', async () => {
  render(<RideSharingApp />);

  await screen.findByTestId('route-preview-map');
  expect(await screen.findByText('1.2x')).toBeInTheDocument();
});

test('shows granular pricing breakdown including booking fee and tip amount', async () => {
  render(<RideSharingApp />);

  expect(await screen.findByText(/booking fee:/i)).toBeInTheDocument();
  expect(screen.getByText(/tip selected: 10% \(\$/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/promo code/i), {
    target: { value: 'SAVE10' }
  });

  expect(await screen.findByText(/promo discount: -\$/i)).toBeInTheDocument();
});

test('blocks direct ride requests for inter-island routes', async () => {
  render(<RideSharingApp />);

  fireEvent.change(screen.getByLabelText(/dropoff/i), {
    target: { value: 'Christiansted Boardwalk (St. Croix)' }
  });

  expect(
    await screen.findByText(/route crosses islands/i)
  ).toBeInTheDocument();
  expect(await screen.findByText(/inter-island transfer plan/i)).toBeInTheDocument();
  expect(screen.getByText(/passenger ferry|seaplane|flight/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /island travel alerts/i })).toBeInTheDocument();

  const requestButton = screen.getByRole('button', { name: /requires island transfer/i });
  expect(requestButton).toBeDisabled();
});
