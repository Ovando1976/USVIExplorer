import { useState } from 'react';

const defaultSites = [
  { id: 1, name: 'Fort Christian', location: 'Charlotte Amalie, St. Thomas' },
  { id: 2, name: 'Estate Whim Plantation', location: 'St. Croix' },
  { id: 3, name: 'Cruz Bay Historic District', location: 'St. John' }
];

export default function HistoricSiteList({ sites = defaultSites }) {
  const [query, setQuery] = useState('');
  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(query.toLowerCase()) ||
      site.location.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="App">
      <h2>Historic Sites</h2>
      <input
        type="text"
        placeholder="Search sites"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {filteredSites.map((site) => (
          <li key={site.id}>
            <strong>{site.name}</strong> - {site.location}
          </li>
        ))}
      </ul>
    </div>
  );
}
