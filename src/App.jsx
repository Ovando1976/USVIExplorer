import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HistoricSiteList from './components/HistoricSiteList';
import HistoricMapApp from './components/HistoricMapApp';
import RideSharingApp from './components/RideSharingApp';
import StripePayment from './components/StripePayment';
import './App.css';

function Home() {
  return (
    <div className="App-header">
      <img src="/usvi-logo.svg" className="App-logo" alt="USVI logo" />
      <h1>USVI Historic Explorer</h1>
      <p>Discover historic sites across the islands.</p>
      <Link className="App-link" to="/sites">View Sites</Link>
      <Link className="App-link" to="/map">Historic Map</Link>
      <Link className="App-link" to="/ride">Ride Sharing</Link>
      <Link className="App-link" to="/checkout">Checkout</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sites" element={<HistoricSiteList />} />
        <Route path="/map" element={<HistoricMapApp />} />
        <Route path="/ride" element={<RideSharingApp />} />
        <Route path="/checkout" element={<StripePayment />} />
      </Routes>
    </Router>
  );
}

export default App;
