import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ManagerDetail from '../components/ManagerDetail';

export default function SalesManagers() {
  const [selectedManager, setSelectedManager] = useState(null);

  return (
    <div>
      <h3>Sales Managers</h3>
      <div className="d-flex gap-3">
        <div style={{ minWidth: 260 }}>
          <Sidebar onSelect={setSelectedManager} selectedId={selectedManager?.id} />
        </div>
        <div className="flex-grow-1">
          {selectedManager
            ? <ManagerDetail manager={selectedManager} />
            : <div className="text-muted mt-3">Select a manager from the left to view details.</div>
          }
        </div>
      </div>
    </div>
  );
}
