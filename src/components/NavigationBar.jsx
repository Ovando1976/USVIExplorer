import { NavLink, Link } from 'react-router-dom';
import './NavigationBar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/sites', label: 'Sites' },
  { to: '/map', label: 'Map' },
  { to: '/ride', label: 'Ride' },
  { to: '/donate', label: 'Donate' },
  { to: '/explore', label: 'Explore' },
  { to: '/driver', label: 'Driver' },
  { to: '/admin', label: 'Admin' }
];

export default function NavigationBar() {
  return (
    <nav className="nav-bar" aria-label="Primary">
      <Link className="nav-brand" to="/">
        <img src="/usvi-logo.svg" alt="" aria-hidden="true" />
        <span>USVI Explorer</span>
      </Link>
      {links.map((link) => (
        <NavLink
          key={link.to}
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          to={link.to}
          end={link.to === '/'}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
