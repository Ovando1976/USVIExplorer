export const transitLocations = [
  {
    name: 'Cyril E. King Airport (STT)',
    island: 'St. Thomas',
    type: 'airport',
    coords: { lat: 18.3373, lng: -64.9733 }
  },
  {
    name: 'Charlotte Amalie (St. Thomas)',
    island: 'St. Thomas',
    type: 'city',
    coords: { lat: 18.3419, lng: -64.9307 }
  },
  {
    name: 'Red Hook Ferry Terminal',
    island: 'St. Thomas',
    type: 'ferry',
    coords: { lat: 18.3248, lng: -64.867 }
  },
  {
    name: 'Cruz Bay Ferry Dock (St. John)',
    island: 'St. John',
    type: 'ferry',
    coords: { lat: 18.3318, lng: -64.7935 }
  },
  {
    name: 'Henry E. Rohlsen Airport (STX)',
    island: 'St. Croix',
    type: 'airport',
    coords: { lat: 17.701, lng: -64.7986 }
  },
  {
    name: 'Christiansted Boardwalk (St. Croix)',
    island: 'St. Croix',
    type: 'city',
    coords: { lat: 17.7465, lng: -64.7059 }
  }
];

const transferTemplates = {
  'St.Thomas->St.John': {
    mode: 'Passenger ferry',
    from: 'Red Hook Ferry Terminal',
    to: 'Cruz Bay Ferry Dock (St. John)',
    durationMinutes: 25,
    cadence: 'Departs every 30 minutes during daytime service'
  },
  'St.John->St.Thomas': {
    mode: 'Passenger ferry',
    from: 'Cruz Bay Ferry Dock (St. John)',
    to: 'Red Hook Ferry Terminal',
    durationMinutes: 25,
    cadence: 'Departs every 30 minutes during daytime service'
  },
  'St.Thomas->St.Croix': {
    mode: 'Seaplane or regional flight',
    from: 'Cyril E. King Airport (STT)',
    to: 'Henry E. Rohlsen Airport (STX)',
    durationMinutes: 40,
    cadence: 'Limited windows; pre-book recommended'
  },
  'St.Croix->St.Thomas': {
    mode: 'Seaplane or regional flight',
    from: 'Henry E. Rohlsen Airport (STX)',
    to: 'Cyril E. King Airport (STT)',
    durationMinutes: 40,
    cadence: 'Limited windows; pre-book recommended'
  },
  'St.John->St.Croix': {
    mode: 'Ferry + flight transfer',
    from: 'Cruz Bay Ferry Dock (St. John)',
    to: 'Henry E. Rohlsen Airport (STX)',
    durationMinutes: 95,
    cadence: 'Travel via Red Hook and STT connector'
  },
  'St.Croix->St.John': {
    mode: 'Flight + ferry transfer',
    from: 'Henry E. Rohlsen Airport (STX)',
    to: 'Cruz Bay Ferry Dock (St. John)',
    durationMinutes: 95,
    cadence: 'Travel via STT connector and Red Hook ferry'
  }
};

export const serviceAlerts = [
  {
    id: 'alert-stt-cruise',
    island: 'St. Thomas',
    severity: 'high',
    title: 'Cruise port surge expected 11:00am–2:00pm',
    impact: 'Pickup ETAs near Charlotte Amalie may increase by 10–15 minutes.'
  },
  {
    id: 'alert-stj-ferry',
    island: 'St. John',
    severity: 'medium',
    title: 'Cruz Bay ferry line longer than usual',
    impact: 'Transfer handoffs may require an additional 20-minute buffer.'
  },
  {
    id: 'alert-stx-rain',
    island: 'St. Croix',
    severity: 'low',
    title: 'Light rain bands near Christiansted',
    impact: 'Expect slightly slower loading/unloading around the boardwalk area.'
  }
];

export const locationCoords = Object.fromEntries(
  transitLocations.map((location) => [location.name, location.coords])
);

export const locationDetails = Object.fromEntries(
  transitLocations.map((location) => [location.name, location])
);

export function planInterIslandTransfer(pickupName, dropoffName) {
  const pickup = locationDetails[pickupName];
  const dropoff = locationDetails[dropoffName];

  if (!pickup || !dropoff || pickup.island === dropoff.island) {
    return null;
  }

  const key = `${pickup.island.replace(' ', '')}->${dropoff.island.replace(' ', '')}`;
  const template = transferTemplates[key];

  if (!template) {
    return {
      mode: 'Island connector required',
      from: pickup.name,
      to: dropoff.name,
      durationMinutes: 90,
      cadence: 'Schedule confirmation required with operations'
    };
  }

  return template;
}
