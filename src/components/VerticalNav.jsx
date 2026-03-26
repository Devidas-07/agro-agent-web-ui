import React from 'react';
import { NavLink } from 'react-router-dom';

export default function VerticalNav() {
  const linkClass = ({ isActive }) => 'nav-link text-white ' + (isActive ? 'active bg-dark' : '');

  return (
    <nav className="d-flex flex-column vh-100 p-3 bg-primary text-white sidebar-nav">
      <h3 className="text-white">AgroAgent</h3>
      <ul className="nav nav-pills flex-column mt-3">
        <li className="nav-item mb-1">
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink to="/products" className={linkClass}>Products</NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink to="/salesmanagers" className={linkClass}>Sales Managers</NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink to="/sales" className={linkClass}>Sales History</NavLink>
        </li>
        <li className="nav-item mb-1">
          <NavLink to="/expired-products" className={linkClass}>Expired Products</NavLink>
        </li>
      </ul>
      <div className="mt-auto small text-white-50">© {new Date().getFullYear()} AgroAgent</div>
    </nav>
  );
}