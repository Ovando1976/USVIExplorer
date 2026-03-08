import { useMemo, useState } from 'react';
import { serviceAlerts, transitLocations } from '../data/usviTransit';

const metrics = [
  { label: 'Active Riders', value: 1284, trend: '+12%' },
  { label: 'Online Drivers', value: 246, trend: '+8%' },
  { label: 'Completed Trips Today', value: 3912, trend: '+16%' },
  { label: 'Net Revenue (24h)', value: '$48,290', trend: '+11%' }
];

const queue = [
  { id: 'TR-10291', rider: 'N. George', driver: 'A. Joseph', island: 'St. Thomas', status: 'En route', eta: '6 min' },
  { id: 'TR-10288', rider: 'L. Ramos', driver: 'M. Francis', island: 'St. John', status: 'Awaiting pickup', eta: '3 min' },
  { id: 'TR-10283', rider: 'E. Charles', driver: 'D. Bell', island: 'St. Croix', status: 'Dispute review', eta: '--' }
];

const islandDemand = [
  { island: 'St. Thomas', demand: 'Very high', note: 'Airport + cruise traffic surge' },
  { island: 'St. John', demand: 'Moderate', note: 'Ferry transfer window active' },
  { island: 'St. Croix', demand: 'Growing', note: 'Business corridor evening peak' }
];

const islands = ['All islands', 'St. Thomas', 'St. John', 'St. Croix'];

const islandHubCount = transitLocations.reduce((acc, location) => {
  acc[location.island] = (acc[location.island] || 0) + 1;
  return acc;
}, {});

function alertWeight(severity) {
  if (severity === 'high') return 15;
  if (severity === 'medium') return 8;
  return 3;
}

export default function AdminHub() {
  const [selectedIsland, setSelectedIsland] = useState('All islands');

  const filteredAlerts = useMemo(
    () =>
      selectedIsland === 'All islands'
        ? serviceAlerts
        : serviceAlerts.filter((alert) => alert.island === selectedIsland),
    [selectedIsland]
  );

  const filteredQueue = useMemo(
    () =>
      selectedIsland === 'All islands'
        ? queue
        : queue.filter((trip) => trip.island === selectedIsland),
    [selectedIsland]
  );

  const operationsHealth = useMemo(() => {
    const baseScore = 100;
    const alertPenalty = filteredAlerts.reduce((sum, alert) => sum + alertWeight(alert.severity), 0);
    const disputePenalty = filteredQueue.filter((trip) => trip.status === 'Dispute review').length * 10;
    return Math.max(55, baseScore - alertPenalty - disputePenalty);
  }, [filteredAlerts, filteredQueue]);

  return (
    <div className="App">
      <section className="page-card admin-hub">
        <div>
          <h2 className="section-title">Operations Admin Hub</h2>
          <p>Monitor marketplace health, dispatch quality, and trust & safety in one place.</p>
        </div>

        <div className="admin-metrics">
          {metrics.map((metric) => (
            <article key={metric.label} className="admin-metric-card">
              <span>{metric.label}</span>
              <strong>{typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}</strong>
              <small>{metric.trend} vs yesterday</small>
            </article>
          ))}
          <article className="admin-metric-card admin-health-card">
            <span>Operations Health Score</span>
            <strong>{operationsHealth}/100</strong>
            <small>Derived from active alerts + unresolved disputes</small>
          </article>
        </div>

        <section className="admin-panel">
          <h3>Island filter</h3>
          <div className="admin-island-filter" role="tablist" aria-label="Filter operations by island">
            {islands.map((island) => (
              <button
                key={island}
                type="button"
                role="tab"
                aria-selected={selectedIsland === island}
                className={`admin-filter-chip${selectedIsland === island ? ' active' : ''}`}
                onClick={() => setSelectedIsland(island)}
              >
                {island}
              </button>
            ))}
          </div>
        </section>

        <div className="admin-grid">
          <section className="admin-panel">
            <h3>Live Trip Queue</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Trip</th>
                    <th>Rider</th>
                    <th>Driver</th>
                    <th>Island</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.rider}</td>
                      <td>{row.driver}</td>
                      <td>{row.island}</td>
                      <td>{row.status}</td>
                      <td>{row.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-panel">
            <h3>Critical controls</h3>
            <div className="admin-actions">
              <button type="button">Adjust surge zones</button>
              <button type="button">Dispatch backup drivers</button>
              <button type="button">Open safety incident bridge</button>
              <button type="button">Broadcast rider alert</button>
            </div>
          </section>
        </div>

        <section className="admin-panel">
          <h3>Service hub coverage</h3>
          <div className="admin-demand-grid">
            {Object.entries(islandHubCount).map(([island, count]) => (
              <article key={island} className="admin-demand-card">
                <strong>{island}</strong>
                <span>{count} service hubs</span>
                <small>Airports, ferry docks, and town centers covered</small>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <h3>Active service advisories</h3>
          <div className="admin-alert-list">
            {filteredAlerts.map((alert) => (
              <article key={alert.id} className={`admin-alert-card ${alert.severity}`}>
                <span>{alert.island}</span>
                <strong>{alert.title}</strong>
                <p>{alert.impact}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <h3>Island demand monitor</h3>
          <div className="admin-demand-grid">
            {islandDemand.map((item) => (
              <article key={item.island} className="admin-demand-card">
                <strong>{item.island}</strong>
                <span>{item.demand}</span>
                <small>{item.note}</small>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
