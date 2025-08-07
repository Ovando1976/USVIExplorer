import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMemo } from 'react';

export const historicSites = [
  { name: 'Fort Christian', position: { lat: 18.3419, lng: -64.9307 } },
  { name: 'Estate Whim Plantation', position: { lat: 17.6995, lng: -64.8513 } },
  { name: 'Cruz Bay Historic District', position: { lat: 18.334, lng: -64.7927 } }
];

function HistoricMapApp() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const center = useMemo(() => historicSites[0].position, []);

  return (
    <div className="App">
      <h2>Historic Map</h2>
      {!isLoaded ? (
        <p>🧭 Loading map...</p>
      ) : (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={center}
          zoom={10}
        >
          {historicSites.map((site) => (
            <Marker key={site.name} position={site.position} title={site.name} />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}

export default HistoricMapApp;
