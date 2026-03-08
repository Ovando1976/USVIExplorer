import { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import {
  locationCoords,
  locationDetails,
  planInterIslandTransfer,
  serviceAlerts
} from '../data/usviTransit';

const RoutePreviewMap = lazy(() => import('./RoutePreviewMap'));

const driverProfiles = [
  {
    name: 'Ava Joseph',
    rating: 4.98,
    trips: 1243,
    vehicle: 'Toyota Highlander • Silver',
    eta: '3 min'
  },
  {
    name: 'Malik Francis',
    rating: 4.94,
    trips: 987,
    vehicle: 'Honda Pilot • Blue',
    eta: '4 min'
  }
];

const rideOptions = [
  { id: 'standard', label: 'Island Standard', multiplier: 1.0, seats: 4 },
  { id: 'xl', label: 'Island XL', multiplier: 1.35, seats: 6 },
  { id: 'premium', label: 'Island Premium', multiplier: 1.75, seats: 4 }
];

const trustBadges = [
  { label: 'Verified drivers', detail: 'Background checks + local licensing' },
  { label: 'SOS support', detail: '24/7 safety hotline' },
  { label: 'Live trip share', detail: 'Share ETA with friends' },
  { label: 'Ferry aware dispatch', detail: 'Timed for Red Hook, Cruz Bay, and STX routes' }
];

const statusSteps = [
  { key: 'requested', label: 'Requested' },
  { key: 'matched', label: 'Driver matched' },
  { key: 'confirmed', label: 'Pickup confirmed' },
  { key: 'enroute', label: 'En route' }
];

const paymentMethods = [
  { id: 'visa', label: 'Visa •••• 4242' },
  { id: 'mastercard', label: 'Mastercard •••• 1055' },
  { id: 'applepay', label: 'Apple Pay' }
];

const tipOptions = ['0%', '10%', '15%', '20%'];

const islandOpsNotes = [
  'St. Thomas peak demand: Airport ↔ Red Hook (cruise/ferry windows)',
  'St. John linkage: Cruz Bay transfers synced to ferry arrivals',
  'St. Croix expansion: STX airport and Christiansted business corridor'
];

export default function RideSharingApp() {
  const [pickup, setPickup] = useState('Cyril E. King Airport (STT)');
  const [dropoff, setDropoff] = useState('Red Hook Ferry Terminal');
  const [estimate, setEstimate] = useState({
    fare: null,
    minutes: null,
    miles: null,
    breakdown: null
  });
  const [status, setStatus] = useState('idle');
  const [selectedDriver, setSelectedDriver] = useState(driverProfiles[0]);
  const [selectedRide, setSelectedRide] = useState(rideOptions[0]);
  const [riders, setRiders] = useState('1');
  const [pickupTime, setPickupTime] = useState('ASAP');
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  const [tip, setTip] = useState(tipOptions[1]);
  const [preferences, setPreferences] = useState({
    quietRide: false,
    extraLuggage: false,
    accessibility: false
  });

  const pickupCoords = locationCoords[pickup];
  const dropoffCoords = locationCoords[dropoff];
  const pickupInfo = locationDetails[pickup];
  const dropoffInfo = locationDetails[dropoff];

  const requiresInterIslandTransfer = pickupInfo?.island !== dropoffInfo?.island;
  const transferPlan = useMemo(
    () => planInterIslandTransfer(pickup, dropoff),
    [pickup, dropoff]
  );

  const surge = useMemo(() => {
    if (pickupInfo?.type === 'airport') {
      return pickupInfo.island === 'St. Thomas' ? 1.2 : 1.1;
    }
    return 1.0;
  }, [pickupInfo]);
  const discount = useMemo(() => (promoCode.trim().length >= 4 ? 0.9 : 1.0), [promoCode]);

  const activeAlerts = useMemo(() => {
    const islands = [pickupInfo?.island, dropoffInfo?.island].filter(Boolean);
    return serviceAlerts.filter((alert) => islands.includes(alert.island));
  }, [pickupInfo, dropoffInfo]);


  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;
    const distance = Math.sqrt(
      Math.pow(pickupCoords.lat - dropoffCoords.lat, 2) +
        Math.pow(pickupCoords.lng - dropoffCoords.lng, 2)
    );
    const miles = Math.max(1, Math.round(distance * 69));
    const baseFare = 8;
    const distanceCharge = distance * 40;
    const tripSubtotal = baseFare + distanceCharge;
    const rideTypeAdjustment = tripSubtotal * (selectedRide.multiplier - 1);
    const surgedSubtotal = (tripSubtotal + rideTypeAdjustment) * surge;
    const surgeAdjustment = surgedSubtotal - (tripSubtotal + rideTypeAdjustment);
    const promoDiscount = surgedSubtotal * (1 - discount);
    const bookingFee = 2.5;
    const fare = surgedSubtotal - promoDiscount + bookingFee;
    const minutes = Math.max(8, Math.round((miles / 25) * 60));

    setEstimate({
      fare: fare.toFixed(2),
      minutes,
      miles,
      breakdown: {
        baseFare,
        distanceCharge,
        rideTypeAdjustment,
        surgeAdjustment,
        promoDiscount,
        bookingFee
      }
    });
  }, [pickup, dropoff, pickupCoords, dropoffCoords, surge, selectedRide, discount]);

  useEffect(() => {
    if (status !== 'searching') return undefined;
    const timer = setTimeout(() => {
      setSelectedDriver(driverProfiles[Math.floor(Math.random() * driverProfiles.length)]);
      setStatus('matched');
    }, 2000);
    return () => clearTimeout(timer);
  }, [status]);

  function handleSwap() {
    setPickup(dropoff);
    setDropoff(pickup);
  }

  function handleRequestRide() {
    if (requiresInterIslandTransfer) {
      return;
    }

    if (status === 'idle') {
      setStatus('searching');
      return;
    }
    if (status === 'matched') {
      setStatus('confirmed');
      return;
    }
    if (status === 'confirmed') {
      setStatus('enroute');
    }
  }

  function handleCancel() {
    setStatus('idle');
  }

  const isMatched = status === 'matched' || status === 'confirmed' || status === 'enroute';
  const activeStep = status === 'idle' ? 'requested' : status === 'searching' ? 'requested' : status;
  const progressValue = status === 'idle' || status === 'searching' ? 25 : status === 'matched' ? 50 : status === 'confirmed' ? 75 : 100;
  const tipMultiplier = Number(tip.replace('%', '')) / 100;
  const baseFare = estimate.fare ? Number(estimate.fare) : 0;
  const tipAmount = baseFare * tipMultiplier;
  const totalFare = (baseFare + tipAmount).toFixed(2);

  function handlePreferenceChange(key) {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="App">
      <section className="page-card ride-card">
        <div className="ride-header">
          <div>
            <h2 className="section-title">Ride Sharing</h2>
            <p>Plan a quick ride between popular stops and preview the route.</p>
          </div>
          <button type="button" className="ride-swap" onClick={handleSwap}>
            Swap
          </button>
        </div>

        <div className="ride-grid">
          <div className="ride-field">
            <label htmlFor="ride-pickup">Pickup</label>
            <select
              id="ride-pickup"
              className="ride-select"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            >
              {Object.keys(locationCoords).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="ride-field">
            <label htmlFor="ride-dropoff">Dropoff</label>
            <select
              id="ride-dropoff"
              className="ride-select"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            >
              {Object.keys(locationCoords).map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="ride-field">
            <label htmlFor="ride-riders">Riders</label>
            <select
              id="ride-riders"
              className="ride-select"
              value={riders}
              onChange={(e) => setRiders(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          <div className="ride-field">
            <label htmlFor="ride-time">Pickup time</label>
            <select
              id="ride-time"
              className="ride-select"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            >
              <option value="ASAP">ASAP</option>
              <option value="In 15 min">In 15 min</option>
              <option value="In 30 min">In 30 min</option>
              <option value="In 1 hour">In 1 hour</option>
            </select>
          </div>

          <div className="ride-field">
            <label htmlFor="ride-promo">Promo code</label>
            <input
              id="ride-promo"
              className="ride-input"
              type="text"
              placeholder="ISLAND10"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </div>
        </div>

        <div className="ride-options">
          <h3>Choose your ride</h3>
          <div className="ride-option-grid">
            {rideOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`ride-option${selectedRide.id === option.id ? ' active' : ''}`}
                onClick={() => setSelectedRide(option)}
              >
                <div>
                  <strong>{option.label}</strong>
                  <p>{option.seats} seats • {option.multiplier}x base fare</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="ride-estimate">
          <div>
            <span className="ride-estimate-label">Estimated Fare</span>
            <strong>{estimate.fare ? `$${estimate.fare}` : 'Calculating...'}</strong>
          </div>
          <div>
            <span className="ride-estimate-label">Trip Time</span>
            <strong>
              {estimate.minutes ? `${estimate.minutes}-${estimate.minutes + 8} min` : 'Calculating...'}
            </strong>
          </div>
          <div>
            <span className="ride-estimate-label">Distance</span>
            <strong>{estimate.miles ? `${estimate.miles} mi` : 'Calculating...'}</strong>
          </div>
          <div>
            <span className="ride-estimate-label">Surge</span>
            <strong>{surge === 1 ? 'No surge' : `${surge.toFixed(1)}x`}</strong>
          </div>
        </div>

        <div className="ride-summary">
          <div>
            <h3>Trip summary</h3>
            <p>{pickup} → {dropoff}</p>
            <span className="ride-summary-pill">{selectedRide.label}</span>
            <span className="ride-summary-pill">{pickupTime}</span>
            <span className="ride-summary-pill">{riders} rider{riders === '1' ? '' : 's'}</span>
          </div>
          <div>
            <h4>Pricing breakdown</h4>
            <ul>
              <li>Base fare: ${estimate.breakdown ? estimate.breakdown.baseFare.toFixed(2) : '0.00'}</li>
              <li>Distance + time: ${estimate.breakdown ? estimate.breakdown.distanceCharge.toFixed(2) : '0.00'}</li>
              <li>Ride type adjustment: ${estimate.breakdown ? estimate.breakdown.rideTypeAdjustment.toFixed(2) : '0.00'}</li>
              <li>Surge adjustment: ${estimate.breakdown ? estimate.breakdown.surgeAdjustment.toFixed(2) : '0.00'}</li>
              <li>Promo discount: -${estimate.breakdown ? estimate.breakdown.promoDiscount.toFixed(2) : '0.00'}</li>
              <li>Booking fee: ${estimate.breakdown ? estimate.breakdown.bookingFee.toFixed(2) : '0.00'}</li>
              <li>Tip selected: {tip} (${tipAmount.toFixed(2)})</li>
            </ul>
          </div>
        </div>


        {transferPlan && (
          <section className="ride-transfer-plan" aria-live="polite">
            <h3>Inter-island transfer plan</h3>
            <p>
              Complete this connector first: <strong>{transferPlan.mode}</strong>
            </p>
            <ul>
              <li>Transfer start: {transferPlan.from}</li>
              <li>Transfer end: {transferPlan.to}</li>
              <li>Estimated transfer time: {transferPlan.durationMinutes} min</li>
              <li>Schedule: {transferPlan.cadence}</li>
            </ul>
          </section>
        )}

        <div className="ride-map">
          {pickupCoords && dropoffCoords ? (
            <Suspense fallback={<p>🧭 Loading map preview...</p>}>
              <RoutePreviewMap pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} />
            </Suspense>
          ) : (
            <p>Select pickup and dropoff to preview the route.</p>
          )}
        </div>


        {activeAlerts.length > 0 && (
          <section className="ride-alerts" aria-live="polite">
            <h3>Island travel alerts</h3>
            <div className="ride-alert-grid">
              {activeAlerts.map((alert) => (
                <article key={alert.id} className={`ride-alert-card ${alert.severity}`}>
                  <span className="ride-alert-severity">{alert.severity.toUpperCase()}</span>
                  <strong>{alert.title}</strong>
                  <p>{alert.impact}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="ride-status">
          <div>
            <h3>Trip status</h3>
            <p>{isMatched ? `Driver ${selectedDriver.name} is on the way.` : 'Ready to match you with a driver.'}</p>
            {requiresInterIslandTransfer && (
              <p className="ride-transfer-alert">
                This route crosses islands. Use the ferry/air connector planner to complete the transfer before requesting the on-island ride.
              </p>
            )}
            <div className="ride-progress">
              <div className="ride-progress-bar" style={{ width: `${progressValue}%` }} />
            </div>
          </div>
          <div className="ride-status-steps">
            {statusSteps.map((step) => (
              <div
                key={step.key}
                className={`ride-status-step${activeStep === step.key ? ' active' : ''}`}
              >
                <span className="ride-status-dot" aria-hidden="true" />
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ride-request">
          <div>
            <h3>Live matching</h3>
            <p>Pickup {pickupTime} for {riders} rider{riders === '1' ? '' : 's'}.</p>
          </div>
          <div className="ride-request-actions">
            {status === 'idle' && (
              <button
                className="ride-cta"
                type="button"
                onClick={handleRequestRide}
                disabled={requiresInterIslandTransfer}
              >
                {requiresInterIslandTransfer ? 'Requires island transfer' : 'Request ride'}
              </button>
            )}
            {status === 'searching' && (
              <button className="ride-cta" type="button" onClick={handleCancel}>
                Searching drivers...
              </button>
            )}
            {status === 'matched' && (
              <button className="ride-cta" type="button" onClick={handleRequestRide}>
                Confirm {selectedDriver.eta} pickup
              </button>
            )}
            {status === 'confirmed' && (
              <button className="ride-cta" type="button" onClick={handleRequestRide}>
                Start trip
              </button>
            )}
            {status === 'enroute' && (
              <button className="ride-cta" type="button" onClick={handleCancel}>
                End trip
              </button>
            )}
          </div>
        </div>

        <div className="ride-driver">
          <div>
            <h3>Driver match</h3>
            <p>Top-rated local drivers with verified vehicles and licenses.</p>
          </div>
          <div className="driver-card">
            <div>
              <strong>{selectedDriver.name}</strong>
              <p>{selectedDriver.vehicle}</p>
            </div>
            <div>
              <span className="driver-rating">⭐ {selectedDriver.rating}</span>
              <span className="driver-trips">{selectedDriver.trips} trips</span>
              <span className="driver-eta">ETA {selectedDriver.eta}</span>
            </div>
          </div>
        </div>

        <div className="ride-preferences">
          <div>
            <h3>Ride preferences</h3>
            <p>Personalize comfort and accessibility needs for your trip.</p>
          </div>
          <div className="ride-preference-grid">
            <label className="ride-preference">
              <input
                type="checkbox"
                checked={preferences.quietRide}
                onChange={() => handlePreferenceChange('quietRide')}
              />
              <span>Quiet ride</span>
            </label>
            <label className="ride-preference">
              <input
                type="checkbox"
                checked={preferences.extraLuggage}
                onChange={() => handlePreferenceChange('extraLuggage')}
              />
              <span>Extra luggage</span>
            </label>
            <label className="ride-preference">
              <input
                type="checkbox"
                checked={preferences.accessibility}
                onChange={() => handlePreferenceChange('accessibility')}
              />
              <span>Accessibility support</span>
            </label>
          </div>
        </div>

        <div className="ride-payment">
          <div>
            <h3>Payment & tip</h3>
            <p>Choose your payment method and set a driver tip.</p>
          </div>
          <div className="ride-payment-grid">
            <div className="ride-payment-column">
              <label htmlFor="ride-payment-method">Payment method</label>
              <select
                id="ride-payment-method"
                className="ride-select"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
              >
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="ride-payment-column">
              <span className="ride-estimate-label">Tip</span>
              <div className="ride-tip-group">
                {tipOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`ride-tip${tip === option ? ' active' : ''}`}
                    onClick={() => setTip(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="ride-payment-total">
              <span className="ride-estimate-label">Estimated total</span>
              <strong>{baseFare ? `$${totalFare}` : 'Calculating...'}</strong>
            </div>
          </div>
        </div>

        <div className="ride-trust">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="ride-trust-card">
              <strong>{badge.label}</strong>
              <p>{badge.detail}</p>
            </div>
          ))}
        </div>

        <div className="ride-island-notes">
          <h3>USVI operations playbook</h3>
          <ul>
            {islandOpsNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="ride-feature-grid">
          <div className="ride-feature">
            <h4>Safety first</h4>
            <p>Share live trip status, SOS support, and verified rider/driver profiles.</p>
          </div>
          <div className="ride-feature">
            <h4>Island pricing</h4>
            <p>Transparent fare breakdowns, no surprise fees, and local driver incentives.</p>
          </div>
          <div className="ride-feature">
            <h4>Community powered</h4>
            <p>Partnered with local businesses to offer bundled experiences and tours.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
