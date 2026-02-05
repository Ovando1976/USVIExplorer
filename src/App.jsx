import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import './App.css';

const HistoricSiteList = lazy(() => import('./components/HistoricSiteList'));
const HistoricMapApp = lazy(() => import('./components/HistoricMapApp'));
const RideSharingApp = lazy(() => import('./components/RideSharingApp'));
const StripePayment = lazy(() => import('./components/StripePayment'));
const ExplorePage = lazy(() => import('./components/ExplorePage'));

function Home() {
  return (
    <div className="App-header">
      <img src="/usvi-logo.svg" className="App-logo" alt="USVI logo" />
      <h1>USVI Historic Explorer</h1>
      <p>Discover historic sites across the islands.</p>
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
          <Route path="/donate" element={<StripePayment />} />
          <Route path="/checkout" element={<StripePayment />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
