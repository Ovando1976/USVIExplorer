import { useState } from 'react';
import BeachMapWithControls from './BeachMapWithControls';
import TourGuidePanel from './TourGuidePanel';

export default function ExplorePage() {
  const [context, setContext] = useState(
    'You are exploring the Virgin Islands. Show helpful info.'
  );

  function handleMapSelect(feature) {
    const summary = `The user selected: ${feature.name}, located at ${
      feature.location || feature.latLng || ''
    }. It is a ${feature.type}. ${
      feature.description ? 'Description: ' + feature.description : ''
    }`;
    setContext(summary);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '100vh' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <BeachMapWithControls onSelect={handleMapSelect} />
      </div>
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <TourGuidePanel context={context} />
      </div>
    </div>
  );
}
