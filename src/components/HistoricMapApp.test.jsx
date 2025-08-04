import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

let mockUseJsApiLoader;
vi.mock('@react-google-maps/api', () => {
  mockUseJsApiLoader = vi.fn(() => ({ isLoaded: true }));
  return {
    GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
    Marker: ({ title }) => <div data-testid="marker">{title}</div>,
    useJsApiLoader: mockUseJsApiLoader,
  };
});

test('renders map with markers when loaded', async () => {
  const { default: HistoricMapApp, historicSites } = await import('./HistoricMapApp');
  render(<HistoricMapApp />);
  expect(screen.getByTestId('google-map')).toBeDefined();
  expect(screen.getAllByTestId('marker')).toHaveLength(historicSites.length);
});

test('shows loading state when API not loaded', async () => {
  mockUseJsApiLoader.mockReturnValueOnce({ isLoaded: false });
  const { default: HistoricMapApp } = await import('./HistoricMapApp');
  render(<HistoricMapApp />);
  expect(screen.getByText(/loading map/i)).toBeDefined();
});
