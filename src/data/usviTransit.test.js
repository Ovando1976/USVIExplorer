import { describe, expect, it } from 'vitest';
import { planInterIslandTransfer, serviceAlerts } from './usviTransit';

describe('planInterIslandTransfer', () => {
  it('returns ferry template for St. Thomas to St. John transfers', () => {
    const plan = planInterIslandTransfer(
      'Cyril E. King Airport (STT)',
      'Cruz Bay Ferry Dock (St. John)'
    );

    expect(plan?.mode).toMatch(/ferry/i);
    expect(plan?.from).toBe('Red Hook Ferry Terminal');
  });

  it('returns null for same-island routes', () => {
    const plan = planInterIslandTransfer(
      'Cyril E. King Airport (STT)',
      'Charlotte Amalie (St. Thomas)'
    );

    expect(plan).toBeNull();
  });
});

describe('serviceAlerts', () => {
  it('contains at least one alert per island', () => {
    const islands = new Set(serviceAlerts.map((alert) => alert.island));
    expect(islands.has('St. Thomas')).toBe(true);
    expect(islands.has('St. John')).toBe(true);
    expect(islands.has('St. Croix')).toBe(true);
  });
});
