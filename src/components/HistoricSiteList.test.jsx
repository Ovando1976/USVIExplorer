import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import HistoricSiteList from './HistoricSiteList';
import '@testing-library/jest-dom';

test('lists all historic sites', () => {
  render(<HistoricSiteList />);
  expect(screen.getByText(/Fort Christian/i)).toBeInTheDocument();
  expect(screen.getByText(/Estate Whim Plantation/i)).toBeInTheDocument();
  expect(screen.getByText(/Cruz Bay Historic District/i)).toBeInTheDocument();
});

test('filters sites by search query', async () => {
  render(<HistoricSiteList />);
  const input = screen.getByPlaceholderText(/search sites/i);
  await userEvent.type(input, 'Whim');
  expect(screen.queryByText(/Fort Christian/i)).toBeNull();
  expect(screen.getByText(/Estate Whim Plantation/i)).toBeInTheDocument();
});
