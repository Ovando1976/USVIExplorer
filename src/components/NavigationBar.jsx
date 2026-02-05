import { NavLink } from 'react-router-dom';
import './NavigationBar.css';

export default function NavigationBar() {
  return (
    <nav className="nav-bar" aria-label="Primary">
      <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`} to="/">Home</NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`} to="/sites">Sites</NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`} to="/map">Map</NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`} to="/ride">Ride</NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`} to="/donate">Donate</NavLink>
      <NavLink className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`} to="/explore">Explore</NavLink>
    </nav>
  );
}
