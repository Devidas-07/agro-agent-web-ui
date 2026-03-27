import React, { useEffect, useState } from 'react';
import { getManagers, createManager, deleteManager } from '../api';
import './Sidebar.css';

export default function Sidebar({ onSelect, selectedId }) {
  const [managers, setManagers] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => { load(); }, []);

  const load = () => {
    getManagers().then(res => setManagers(res.data)).catch(err => console.error(err));
  };

  const add = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createManager({ salesManagerName: newName.trim() })
      .then(() => { setNewName(''); load(); })
      .catch(err => console.error(err));
  };

  const remove = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this manager?')) return;
    deleteManager(id).then(() => load()).catch(err => console.error(err));
  };

  return (
    <div className="agro-card manager-sidebar">
      <div className="agro-card-header">
        👥 Managers
        <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#166534', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
          {managers.length}
        </span>
      </div>
      <div style={{ padding: '12px' }}>
        <div className="manager-list">
          {managers.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 12px' }}>
              <div style={{ fontSize: '2rem' }}>👤</div>
              <p style={{ fontSize: '0.82rem', marginTop: '8px' }}>No managers yet</p>
            </div>
          ) : (
            managers.map(m => (
              <div
                key={m.id}
                className={`manager-item ${selectedId === m.id ? 'selected' : ''}`}
                onClick={() => onSelect && onSelect(m)}
              >
                <div className="manager-avatar">
                  {(m.salesManagerName || 'M').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="manager-name">{m.salesManagerName}</div>
                  <div className="manager-sub">ID: {m.id}</div>
                </div>
                <button
                  style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '1rem', padding: '4px', borderRadius: '6px', transition: 'background 0.15s' }}
                  onClick={(e) => remove(e, m.id)}
                  title="Delete manager"
                  onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >✕</button>
              </div>
            ))
          )}
        </div>

        <form className="add-manager-form" onSubmit={add}>
          <input
            placeholder="New manager name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <button type="submit">+ Add</button>
        </form>
      </div>
    </div>
  );
}
