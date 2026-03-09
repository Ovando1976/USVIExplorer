import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import TourGuidePanel from './TourGuidePanel';

vi.mock('../lib/tourGuideAgent', () => ({
  askTourGuide: vi.fn(async () => 'Here is your custom island itinerary.')
}));

test('loads suggested prompt into input', () => {
  render(<TourGuidePanel context="Sample context" />);

  fireEvent.click(screen.getByRole('button', { name: /pack for a st. john beach day/i }));

  expect(screen.getByLabelText(/ask the tour guide/i)).toHaveValue(
    'What should I pack for a St. John beach day?'
  );
});

test('sends question and can clear chat', async () => {
  render(<TourGuidePanel context="Sample context" />);

  fireEvent.change(screen.getByLabelText(/ask the tour guide/i), {
    target: { value: 'Best snorkeling beach?' }
  });
  fireEvent.click(screen.getByRole('button', { name: /^ask$/i }));

  expect(await screen.findByText(/custom island itinerary/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /clear chat/i }));
  expect(screen.getByText(/what makes trunk bay special/i)).toBeInTheDocument();
});
