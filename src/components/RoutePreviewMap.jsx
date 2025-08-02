import { GoogleMap, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { useMemo } from 'react';

export default function RoutePreviewMap({ pickupCoords, dropoffCoords }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const path = useMemo(() => [pickupCoords, dropoffCoords], [pickupCoords, dropoffCoords]);

  if (!isLoaded) {
    return <p>🧭 Loading map...</p>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={pickupCoords}
      zoom={12}
    >
      <Polyline path={path} options={{ strokeColor: '#0000FF', strokeWeight: 2 }} />
    </GoogleMap>
  );
}
