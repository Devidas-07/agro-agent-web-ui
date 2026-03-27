import React, { useState, useRef, useEffect } from 'react';

export default function TopBar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="topbar d-flex justify-content-between align-items-center">
      <div>
        <div className="topbar-title">🌾 AgroAgent Dashboard</div>
        <div className="topbar-subtitle">{dateStr}</div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-md-block">
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1b4332' }}>Admin</div>
          <div style={{ fontSize: '0.75rem', color: '#74a57f' }}>admin@agroagent.com</div>
        </div>

        <div style={{ position: 'relative' }} ref={ref}>
          <button className="avatar-btn" onClick={() => setOpen(s => !s)}>A</button>

          {open && (
            <div className="dropdown-menu-custom">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e8f0e0', background: '#f4f7f0' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#1b4332' }}>Admin User</div>
                <div style={{ fontSize: '0.75rem', color: '#74a57f' }}>Administrator</div>
              </div>
              <div className="dropdown-divider" />
              <button onClick={() => { onLogout(); setOpen(false); }}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
