import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import HistoricSiteList from './HistoricSiteList';

test('lists all historic sites', () => {
  render(<HistoricSiteList />);
  expect(screen.getByText(/Fort Christian/i)).toBeDefined();
  expect(screen.getByText(/Estate Whim Plantation/i)).toBeDefined();
  expect(screen.getByText(/Cruz Bay Historic District/i)).toBeDefined();
});

test('renders a provided list of sites', () => {
  const customSites = [
    { id: 1, name: 'Bluebeard Castle', location: 'Charlotte Amalie' }
  ];

  render(<HistoricSiteList sites={customSites} />);
  expect(screen.getByText(/Bluebeard Castle/i)).toBeDefined();
});
