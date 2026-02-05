export const places = [
  {
    id: 'fort-christian',
    name: 'Fort Christian',
    type: 'historic_site',
    island: 'st_thomas',
    lat: 18.3419,
    lng: -64.9307,
    shortDescription: 'Historic Danish fort and museum in Charlotte Amalie.'
  },
  {
    id: 'estate-whim',
    name: 'Estate Whim Plantation',
    type: 'historic_site',
    island: 'st_croix',
    lat: 17.6995,
    lng: -64.8513,
    shortDescription: 'Preserved plantation museum on St. Croix.'
  },
  {
    id: 'cruz-bay-historic-district',
    name: 'Cruz Bay Historic District',
    type: 'historic_site',
    island: 'st_john',
    lat: 18.334,
    lng: -64.7927,
    shortDescription: 'Historic waterfront district in Cruz Bay.'
  },
  {
    id: 'magens-bay',
    name: 'Magens Bay',
    type: 'beach',
    island: 'st_thomas',
    lat: 18.3624,
    lng: -64.9307,
    shortDescription: 'Popular beach on St. Thomas.'
  },
  {
    id: 'trunk-bay',
    name: 'Trunk Bay',
    type: 'beach',
    island: 'st_john',
    lat: 18.352,
    lng: -64.755,
    shortDescription: 'Scenic beach on St. John.'
  },
  {
    id: 'cyril-e-king-airport',
    name: 'Cyril E. King Airport',
    type: 'transport_hub',
    island: 'st_thomas',
    lat: 18.3373,
    lng: -64.9733,
    shortDescription: 'Main airport serving St. Thomas.'
  },
  {
    id: 'charlotte-amalie',
    name: 'Charlotte Amalie',
    type: 'transport_hub',
    island: 'st_thomas',
    lat: 18.3419,
    lng: -64.9307,
    shortDescription: 'Capital city and ferry/taxi connection point.'
  },
  {
    id: 'red-hook',
    name: 'Red Hook',
    type: 'transport_hub',
    island: 'st_thomas',
    lat: 18.3248,
    lng: -64.867,
    shortDescription: 'Major ferry and transport hub in East End.'
  }
];

export const historicSites = places.filter((place) => place.type === 'historic_site');
export const beaches = places.filter((place) => place.type === 'beach');
export const transportHubs = places.filter((place) => place.type === 'transport_hub');

export const transportHubCoordsByName = Object.fromEntries(
  transportHubs.map((hub) => [hub.name, { lat: hub.lat, lng: hub.lng }])
);
