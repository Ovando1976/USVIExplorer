import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom';
import NavigationBar from './NavigationBar';

test('shows navigation links', () => {
  render(
    <MemoryRouter>
      <NavigationBar />
    </MemoryRouter>
  );
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
  expect(screen.getByText(/Sites/i)).toBeInTheDocument();
  expect(screen.queryByText(/Checkout/i)).not.toBeInTheDocument();
});

test('toggles mobile menu button state and closes after navigation click', () => {
  render(
    <MemoryRouter>
      <NavigationBar />
    </MemoryRouter>
  );

  const menuButton = screen.getByRole('button', { name: /menu/i });
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-expanded', 'true');

  fireEvent.click(screen.getByRole('link', { name: 'Ride' }));
  expect(screen.getByRole('button', { name: /menu/i })).toHaveAttribute('aria-expanded', 'false');
});
