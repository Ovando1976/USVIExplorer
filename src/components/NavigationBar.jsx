import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="nav-bar" aria-label="Primary">
      <div className="nav-main-row">
        <Link className="nav-brand" to="/" onClick={closeMenu}>
          <img src="/usvi-logo.svg" alt="" aria-hidden="true" />
          <span>USVI Explorer</span>
        </Link>

        <button
          type="button"
          className="nav-menu-button"
          aria-expanded={menuOpen}
          aria-controls="primary-nav-links"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      <div id="primary-nav-links" className={`nav-links${menuOpen ? ' open' : ''}`}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            to={link.to}
            end={link.to === '/'}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
