import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div>
      <h3>Welcome, Admin</h3>
      <p className="text-muted">Use the navigation to manage products, sales managers, and sales history.</p>
      <div className="row">
        <div className="col-md-4">
          <Link to="/products" className="text-decoration-none">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Products</h5>
                <p className="card-text">View and manage products.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/salesmanagers" className="text-decoration-none">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Sales Managers</h5>
                <p className="card-text">Add, edit, and delete sales managers.</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/sales" className="text-decoration-none">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Sales History</h5>
                <p className="card-text">Record and view sales history.</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}