import React from 'react';
import Sidebar from '../components/Sidebar';

export default function SalesManagers() {
  return (
    <div>
      <h3>Sales Managers</h3>
      <div className="card">
        <div className="card-body">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}