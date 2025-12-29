import React, { useState } from 'react';

export default function TopBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
      <h4 className="mb-0">Admin Dashboard</h4>
      <div className="d-flex align-items-center position-relative">
        <div className="me-3 text-end d-none d-md-block">
          <div className="fw-bold">Admin</div>
          <div className="text-muted small">admin@agro.com</div>
        </div>
        <div>
          <button className="btn btn-secondary rounded-circle" style={{width:44, height:44}} onClick={() => setOpen(s => !s)}>
            A
          </button>
          {open && (
            <div className="position-absolute bg-white shadow-sm rounded mt-2" style={{right:0, zIndex:1000}}>
              <a className="d-block px-3 py-2 text-dark" href="#/profile">Profile</a>
              <a className="d-block px-3 py-2 text-dark" href="#/settings">Settings</a>
              <div className="dropdown-divider" />
              <a className="d-block px-3 py-2 text-dark" href="#/logout">Logout</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}