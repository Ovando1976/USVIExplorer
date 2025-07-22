import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import HistoricSiteList from './HistoricSiteList';

test('lists all historic sites', () => {
  render(<HistoricSiteList />);
  expect(screen.getByText(/Fort Christian/i)).toBeDefined();
  expect(screen.getByText(/Estate Whim Plantation/i)).toBeDefined();
  expect(screen.getByText(/Cruz Bay Historic District/i)).toBeDefined();
});
