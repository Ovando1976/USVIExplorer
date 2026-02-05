import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMemo } from 'react';
import { historicSites } from '../data/places';

function HistoricMapApp() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const center = useMemo(
    () => ({ lat: historicSites[0].lat, lng: historicSites[0].lng }),
    []
  );

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
            <Marker
              key={site.id}
              position={{ lat: site.lat, lng: site.lng }}
              title={site.name}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}

export default HistoricMapApp;
