import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import HistoricMapApp from './HistoricMapApp';

test('shows map heading', () => {
  render(<HistoricMapApp />);
  expect(screen.getByText(/historic map/i)).toBeDefined();
});
