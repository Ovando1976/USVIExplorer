import { useState } from 'react';
import { historicSites as defaultSites } from '../data/places';

export default function HistoricSiteList({ sites = defaultSites }) {
  const [query, setQuery] = useState('');
  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(query.toLowerCase()) ||
      (site.island || site.location || '').toString().replace('_', ' ').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="App">
      <h2>Historic Sites</h2>
      <label htmlFor="site-search">Search sites</label>
      <input
        id="site-search"
        type="text"
        placeholder="Search sites"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filteredSites.map((site) => (
          <li key={site.id}>
            <strong>{site.name}</strong> - {(site.island || site.location || 'Unknown').toString().replace('_', ' ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
