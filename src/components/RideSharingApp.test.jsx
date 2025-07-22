import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import RideSharingApp from './RideSharingApp';

test('shows ride sharing heading', () => {
  render(<RideSharingApp />);
  expect(screen.getByText(/ride sharing/i)).toBeDefined();
});
