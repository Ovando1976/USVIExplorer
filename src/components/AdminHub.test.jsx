import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminHub from './AdminHub';

test('filters admin alerts by selected island', () => {
  render(<AdminHub />);

  fireEvent.click(screen.getByRole('tab', { name: /st. john/i }));

  expect(screen.getByText(/cruz bay ferry line longer than usual/i)).toBeInTheDocument();
  expect(screen.queryByText(/cruise port surge expected/i)).not.toBeInTheDocument();
});

test('shows operations health score card', () => {
  render(<AdminHub />);

  expect(screen.getByText(/operations health score/i)).toBeInTheDocument();
  expect(screen.getByText(/\/100/i)).toBeInTheDocument();
});
