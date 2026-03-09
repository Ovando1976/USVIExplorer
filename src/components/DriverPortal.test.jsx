import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DriverPortal from './DriverPortal';

test('updates readiness score when checklist items are toggled', () => {
  render(<DriverPortal />);

  expect(screen.getByText('0%')).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText(/driver docs \+ permit verified/i));
  fireEvent.click(screen.getByLabelText(/vehicle inspection completed/i));

  expect(screen.getByText('50%')).toBeInTheDocument();
});

test('renders priority advisories list', () => {
  render(<DriverPortal />);

  expect(screen.getByText(/st. thomas: cruise port surge expected/i)).toBeInTheDocument();
});
