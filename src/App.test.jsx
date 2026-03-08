import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders home page with primary navigation links', () => {
  render(<App />);
  expect(screen.getByText(/USVI Historic Explorer/i)).toBeInTheDocument();

  const nav = screen.getByRole('navigation', { name: /Primary/i });
  expect(nav).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^Sites$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^Map$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /^Ride$/i })).toBeInTheDocument();
});
