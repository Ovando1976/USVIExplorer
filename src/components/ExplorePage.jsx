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
    <main className="explore-layout">
      <section className="explore-map-panel" aria-label="Map explorer">
        <BeachMapWithControls onSelect={handleMapSelect} />
      </section>
      <section className="explore-chat-panel" aria-label="AI tour guide">
        <TourGuidePanel context={context} />
      </section>
    </main>
  );
}
