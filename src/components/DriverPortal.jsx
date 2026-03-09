import { useMemo, useState } from 'react';
import { serviceAlerts, transitLocations } from '../data/usviTransit';

const incentives = [
  'Peak zone bonus: +$5/trip near Red Hook (5pm–8pm)',
  '5-star streak reward: +$40 for 20 trips',
  'Airport pickup priority enabled'
];

const islandRoutes = [
  { route: 'STT Airport → Red Hook', window: '6:00am-10:00am', demand: 'High' },
  { route: 'Red Hook ↔ Cruz Bay Ferry', window: '9:00am-7:00pm', demand: 'Medium' },
  { route: 'STX Airport → Christiansted', window: '2:00pm-9:00pm', demand: 'Growing' }
];

const interIslandConnectors = transitLocations.filter((location) => location.type === 'ferry');
const highPriorityAlerts = serviceAlerts.filter((alert) => alert.severity !== 'low');

const initialChecklist = {
  docsReady: false,
  vehicleChecked: false,
  fuelCharged: false,
  safetyKit: false
};

export default function DriverPortal() {
  const [checklist, setChecklist] = useState(initialChecklist);

  const readinessScore = useMemo(() => {
    const completed = Object.values(checklist).filter(Boolean).length;
    return Math.round((completed / Object.keys(checklist).length) * 100);
  }, [checklist]);

  function toggleChecklist(key) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="App">
      <section className="page-card driver-portal">
        <div>
          <h2 className="section-title">Driver Portal</h2>
          <p>Manage earnings, trip preferences, and support tools in real time.</p>
        </div>

        <div className="driver-stats">
          <article>
            <span>Today&apos;s Earnings</span>
            <strong>$382.40</strong>
          </article>
          <article>
            <span>Trips Completed</span>
            <strong>17</strong>
          </article>
          <article>
            <span>Acceptance Rate</span>
            <strong>96%</strong>
          </article>
          <article>
            <span>Driver Rating</span>
            <strong>4.97 ★</strong>
          </article>
          <article className="driver-readiness-card">
            <span>Shift readiness</span>
            <strong>{readinessScore}%</strong>
          </article>
        </div>

        <div className="driver-grid">
          <section className="driver-panel">
            <h3>Incentives</h3>
            <ul>
              {incentives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="driver-panel">
            <h3>Quick actions</h3>
            <div className="driver-actions">
              <button type="button">Go online</button>
              <button type="button">Set destination filter</button>
              <button type="button">Open emergency support</button>
              <button type="button">Download weekly payout report</button>
            </div>
          </section>
        </div>

        <section className="driver-panel">
          <h3>Pre-shift checklist</h3>
          <div className="driver-checklist">
            <label>
              <input
                type="checkbox"
                checked={checklist.docsReady}
                onChange={() => toggleChecklist('docsReady')}
              />
              Driver docs + permit verified
            </label>
            <label>
              <input
                type="checkbox"
                checked={checklist.vehicleChecked}
                onChange={() => toggleChecklist('vehicleChecked')}
              />
              Vehicle inspection completed
            </label>
            <label>
              <input
                type="checkbox"
                checked={checklist.fuelCharged}
                onChange={() => toggleChecklist('fuelCharged')}
              />
              Fuel/charge level above 70%
            </label>
            <label>
              <input
                type="checkbox"
                checked={checklist.safetyKit}
                onChange={() => toggleChecklist('safetyKit')}
              />
              Safety kit + first aid onboard
            </label>
          </div>
        </section>

        <section className="driver-panel">
          <h3>Priority advisories</h3>
          <ul>
            {highPriorityAlerts.map((alert) => (
              <li key={alert.id}>
                {alert.island}: {alert.title}
              </li>
            ))}
          </ul>
        </section>

        <section className="driver-panel">
          <h3>Inter-island connectors</h3>
          <ul>
            {interIslandConnectors.map((connector) => (
              <li key={connector.name}>
                {connector.name} · {connector.island}
              </li>
            ))}
          </ul>
        </section>

        <section className="driver-panel">
          <h3>Island route planner</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Best window</th>
                  <th>Demand</th>
                </tr>
              </thead>
              <tbody>
                {islandRoutes.map((route) => (
                  <tr key={route.route}>
                    <td>{route.route}</td>
                    <td>{route.window}</td>
                    <td>{route.demand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}
