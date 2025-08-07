const defaultSites = [
  { id: 1, name: 'Fort Christian', location: 'Charlotte Amalie, St. Thomas' },
  { id: 2, name: 'Estate Whim Plantation', location: 'St. Croix' },
  { id: 3, name: 'Cruz Bay Historic District', location: 'St. John' }
];

function HistoricSiteList({ sites = defaultSites }) {
  return (
    <div className="App">
      <h2>Historic Sites</h2>
      <ul>
        {sites.map((site) => (
          <li key={site.id}>
            <strong>{site.name}</strong> - {site.location}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoricSiteList;
