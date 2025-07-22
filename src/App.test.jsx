import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders home page', () => {
  render(<App />);
  expect(screen.getByText(/USVI Historic Explorer/i)).toBeDefined();
  expect(screen.getByRole('link', { name: /view sites/i })).toBeDefined();
});
