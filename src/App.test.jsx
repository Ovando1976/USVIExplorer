import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders home page with navigation', () => {
  render(<App />);
  expect(screen.getByText(/USVI Historic Explorer/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Sites/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Map/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Ride/i })).toBeInTheDocument();
});
