import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useMemo } from 'react';
import { beaches } from '../data/places';

export default function BeachMapWithControls({ onSelect }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const center = useMemo(
    () => ({ lat: beaches[0].lat, lng: beaches[0].lng }),
    []
  );

  function handleMarkerClick(beach) {
    if (onSelect) {
      onSelect({
        name: beach.name,
        type: beach.type,
        location: `${beach.lat}, ${beach.lng}`,
        description: beach.shortDescription
      });
    }
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!isLoaded ? (
        <p>🧭 Loading map...</p>
      ) : (
        <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={10}>
          {beaches.map((beach) => (
            <Marker
              key={beach.id}
              position={{ lat: beach.lat, lng: beach.lng }}
              title={beach.name}
              onClick={() => handleMarkerClick(beach)}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}
