import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HistoricSiteList from './components/HistoricSiteList';
import './App.css';

function Home() {
  return (
    <div className="App-header">
      <img src="/usvi-logo.svg" className="App-logo" alt="USVI logo" />
      <h1>USVI Historic Explorer</h1>
      <p>Discover historic sites across the islands.</p>
      <Link className="App-link" to="/sites">View Sites</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sites" element={<HistoricSiteList />} />
      </Routes>
    </Router>
  );
}

export default App;
