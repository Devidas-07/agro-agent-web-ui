import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ManagerDetail from '../components/ManagerDetail';

export default function SalesManagers() {
  const [selectedManager, setSelectedManager] = useState(null);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' }}>👥</div>
        <div>
          <h3>Sales Managers</h3>
          <p>Manage field agents and assign products</p>
        </div>
      </div>

      <div className="d-flex gap-3 align-items-start">
        <Sidebar onSelect={setSelectedManager} selectedId={selectedManager?.id} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {selectedManager ? (
            <ManagerDetail manager={selectedManager} />
          ) : (
            <div className="agro-card">
              <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>👈</div>
                <h5 style={{ color: '#1b4332', fontWeight: 600 }}>Select a Manager</h5>
                <p style={{ color: '#74a57f', fontSize: '0.88rem' }}>
                  Choose a sales manager from the left panel to view their details, assign products, and track sales.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
