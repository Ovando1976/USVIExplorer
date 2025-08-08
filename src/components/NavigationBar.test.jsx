import { render, screen } from '@testing-library/react';
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
});
