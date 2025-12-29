import React, { useEffect, useState } from 'react';
import { getManagers, createManager, deleteManager } from '../api';
import './Sidebar.css';

export default function Sidebar({ onSelect, selectedId }) {
  const [managers, setManagers] = useState([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    getManagers()
      .then(res => setManagers(res.data))
      .catch(err => console.error(err));
  };

  const add = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    createManager({ salesManagerName: newName.trim() })
      .then(() => {
        setNewName('');
        load();
      })
      .catch(err => console.error(err));
  };

  const remove = (id) => {
    if (!window.confirm('Delete manager?')) return;
    deleteManager(id).then(() => load()).catch(err => console.error(err));
  };

  return (
    <div className="sidebar">
      <h3>Managers</h3>
      <div className="manager-list">
        {managers.map(m => (
          <div key={m.id} className={`manager-item ${selectedId === m.id ? 'selected' : ''}`} onClick={() => onSelect(m)}>
            <div className="avatar">{(m.salesManagerName || 'M').charAt(0)}</div>
            <div className="meta">
              <div className="name">{m.salesManagerName}</div>
              <div className="sub">id: {m.id}</div>
            </div>
            <button className="del" onClick={(e) => { e.stopPropagation(); remove(m.id); }}>✕</button>
          </div>
        ))}
      </div>

      <form className="add-form" onSubmit={add}>
        <input placeholder="New manager name" value={newName} onChange={e => setNewName(e.target.value)} />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}