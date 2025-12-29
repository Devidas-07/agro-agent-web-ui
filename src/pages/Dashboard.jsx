import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h3>Welcome, Admin</h3>
      <p className="text-muted">Use the navigation to manage products, sales managers, and sales history.</p>
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Products</h5>
              <p className="card-text">View and manage products.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Sales Managers</h5>
              <p className="card-text">Add, edit, and delete sales managers.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Sales History</h5>
              <p className="card-text">Record and view sales history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}