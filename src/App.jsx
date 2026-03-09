import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Link, Navigate, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import './App.css';

const HistoricSiteList = lazy(() => import('./components/HistoricSiteList'));
const HistoricMapApp = lazy(() => import('./components/HistoricMapApp'));
const RideSharingApp = lazy(() => import('./components/RideSharingApp'));
const StripeCheckout = lazy(() => import('./components/StripeCheckout'));
const ExplorePage = lazy(() => import('./components/ExplorePage'));
const AdminHub = lazy(() => import('./components/AdminHub'));
const DriverPortal = lazy(() => import('./components/DriverPortal'));

function Home() {
  return (
    <div className="App-header">
      <img src="/usvi-logo.svg" className="App-logo" alt="USVI logo" />
      <h1>USVI Historic Explorer</h1>
      <p className="hero-subtitle">Discover historic sites, maps, and local experiences across the islands.</p>
      <div className="hero-actions">
        <Link className="hero-button primary" to="/explore">Start Exploring</Link>
        <Link className="hero-button secondary" to="/sites">Browse Historic Sites</Link>
      </div>
      <div className="hero-stats">
        <div>
          <strong>3 Islands</strong>
          <span>St. Thomas • St. John • St. Croix</span>
        </div>
        <div>
          <strong>Curated Routes</strong>
          <span>Historic landmarks + coastal escapes</span>
        </div>
        <div>
          <strong>Local Guides</strong>
          <span>Community-driven insights</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <NavigationBar />
      <Suspense fallback={<p className="App">Loading page...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sites" element={<HistoricSiteList />} />
          <Route path="/map" element={<HistoricMapApp />} />
          <Route path="/ride" element={<RideSharingApp />} />
          <Route path="/donate" element={<StripeCheckout />} />
          <Route path="/checkout" element={<Navigate to="/donate" replace />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/admin" element={<AdminHub />} />
          <Route path="/driver" element={<DriverPortal />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
