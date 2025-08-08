import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HistoricSiteList from './components/HistoricSiteList';
import HistoricMapApp from './components/HistoricMapApp';
import RideSharingApp from './components/RideSharingApp';

import StripeCheckout from './components/StripeCheckout';

import StripePayment from './components/StripePayment';
import ExplorePage from './components/ExplorePage';
import NavigationBar from './components/NavigationBar';

import './App.css';

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sites" element={<HistoricSiteList />} />
        <Route path="/map" element={<HistoricMapApp />} />
        <Route path="/ride" element={<RideSharingApp />} />
        <Route path="/donate" element={<StripeCheckout />} />
        <Route path="/checkout" element={<StripePayment />} />
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </Router>
  );
}

export default App;
