import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { useMemo, useState } from 'react';

const beaches = [
  {
    name: 'Magens Bay',
    position: { lat: 18.3624, lng: -64.9307 },
    description: 'Popular beach on St. Thomas with calm waters and amenities.',
    tag: 'Family friendly'
  },
  {
    name: 'Trunk Bay',
    position: { lat: 18.352, lng: -64.755 },
    description: 'Scenic beach on St. John with snorkeling trails.',
    tag: 'Snorkeling'
  }
];

export default function BeachMapWithControls({ onSelect }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const [selectedBeach, setSelectedBeach] = useState(beaches[0]);
  const center = useMemo(() => selectedBeach.position, [selectedBeach]);

  function handleMarkerClick(beach) {
    setSelectedBeach(beach);
    if (onSelect) {
      onSelect({
        name: beach.name,
        type: 'beach',
        location: `${beach.position.lat}, ${beach.position.lng}`,
        description: beach.description
      });
    }
  }

  return (
    <div className="explore-map-container">
      <div className="explore-map-controls">
        <h3>Beach highlights</h3>
        {beaches.map((beach) => (
          <button
            key={beach.name}
            type="button"
            className={`explore-map-button${selectedBeach.name === beach.name ? ' active' : ''}`}
            onClick={() => handleMarkerClick(beach)}
          >
            <span>{beach.name}</span>
            <small>{beach.tag}</small>
          </button>
        ))}
        <div className="explore-map-detail">
          <strong>{selectedBeach.name}</strong>
          <p>{selectedBeach.description}</p>
          <span className="explore-map-tag">{selectedBeach.tag}</span>
        </div>
      </div>

      <div className="explore-map-canvas">
        {!isLoaded ? (
          <p>🧭 Loading map...</p>
        ) : (
          <GoogleMap mapContainerStyle={{ width: '100%', height: '100%' }} center={center} zoom={11}>
            {beaches.map((beach) => (
              <Marker
                key={beach.name}
                position={beach.position}
                title={beach.name}
                onClick={() => handleMarkerClick(beach)}
              />
            ))}
            {selectedBeach && (
              <InfoWindow
                position={selectedBeach.position}
                onCloseClick={() => setSelectedBeach(null)}
              >
                <div className="map-info-window">
                  <strong>{selectedBeach.name}</strong>
                  <p>{selectedBeach.description}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </div>
    </div>
  );
}
