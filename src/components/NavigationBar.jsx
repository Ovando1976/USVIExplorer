import { Link } from 'react-router-dom';
import './NavigationBar.css';

export default function NavigationBar() {
  return (
    <nav className="nav-bar">
      <Link className="nav-link" to="/">Home</Link>
      <Link className="nav-link" to="/sites">Sites</Link>
      <Link className="nav-link" to="/map">Map</Link>
      <Link className="nav-link" to="/ride">Ride</Link>
      <Link className="nav-link" to="/donate">Donate</Link>
      <Link className="nav-link" to="/checkout">Checkout</Link>
      <Link className="nav-link" to="/explore">Explore</Link>
    </nav>
  );
}
