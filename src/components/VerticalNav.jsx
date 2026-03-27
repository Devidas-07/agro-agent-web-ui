import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',                  end: true,  icon: '🏠', label: 'Dashboard'        },
  { to: '/products',          end: false, icon: '🌱', label: 'Products'          },
  { to: '/salesmanagers',     end: false, icon: '👥', label: 'Sales Managers'    },
  { to: '/sales',             end: false, icon: '📊', label: 'Sales History'     },
  { to: '/expired-products',  end: false, icon: '⚠️', label: 'Expired Products'  },
];

export default function VerticalNav() {
  return (
    <nav className="d-flex flex-column vh-100 p-3 sidebar-nav">
      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon">🌾</span>
        <div>
          <div className="sidebar-brand-text">AgroAgent</div>
          <div className="sidebar-brand-sub">Admin Portal</div>
        </div>
      </div>

      {/* Nav links */}
      <ul className="nav flex-column mt-2 flex-grow-1">
        {navItems.map(({ to, end, icon, label }) => (
          <li className="nav-item" key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="sidebar-footer">
        🌿 © {new Date().getFullYear()} AgroAgent<br />
        All rights reserved
      </div>
    </nav>
  );
}
