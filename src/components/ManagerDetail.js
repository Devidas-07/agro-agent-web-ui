import React, { useState, useEffect } from 'react';
import { getProductsByManager, getProducts, createProduct, updateProduct, deleteProduct, assignProductToManager, getSalesByManager, recordSale } from '../api';
import ProductForm from './ProductForm';
import SalesForm from './SalesForm';
import SalesHistory from './SalesHistory';

export default function ManagerDetail({ manager }) {
  const [assignedProducts, setAssignedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState([]);

  const load = () => {
    getProductsByManager(manager.id).then(res => setAssignedProducts(res.data)).catch(e => console.error(e));
    getProducts().then(res => setAllProducts(res.data)).catch(e => console.error(e));
    getSalesByManager(manager.id).then(res => setSales(res.data)).catch(e => console.error(e));
  };

  useEffect(() => {
    if (manager) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manager]);

  const saveProduct = (p) => {
    const action = editing?.id
      ? updateProduct(editing.id, p)
      : createProduct(p);
    action.then(() => { setEditing(null); setShowForm(false); load(); }).catch(e => console.error(e));
  };

  const remove = (id) => {
    if (!window.confirm('Delete product?')) return;
    deleteProduct(id).then(() => load()).catch(e => console.error(e));
  };

  const assign = (p) => {
    assignProductToManager(p.id, manager.id)
      .then(() => {
        load();
        alert(`Product '${p.name}' assigned successfully.`);
      })
      .catch(e => {
        const msg = e.response?.data?.error || 'Failed to assign product.';
        alert(msg);
        load(); // reload to remove expired product from list
      });
  };

  return (
    <div className="manager-detail">
      <div className="manager-header mb-3">
        <h4>{manager.salesManagerName}</h4>
        <small className="text-muted">Manager ID: {manager.id}</small>
      </div>

      {/* All Products — assign from here */}
      <div className="section mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>All Products</h5>
          <button className="btn btn-sm btn-primary" onClick={() => { setEditing(null); setShowForm(s => !s); }}>
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <div className="card mb-3">
            <div className="card-body">
              <ProductForm
                initial={editing || {}}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                onSave={saveProduct}
              />
            </div>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>MRP</th>
                <th>Qty</th>
                <th>Expire Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.length === 0 && (
                <tr><td colSpan="5" className="text-muted">No products available.</td></tr>
              )}
              {allProducts.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.mrp ?? '-'}</td>
                  <td>{p.quantity}</td>
                  <td className={p.expireDate && new Date(p.expireDate) < new Date() ? 'text-danger fw-bold' : ''}>
                    {p.expireDate || '-'}
                  </td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-success" onClick={() => assign(p)}>Assign</button>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => { setEditing(p); setShowForm(true); }}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assigned Products */}
      <div className="section mb-4">
        <h5>Assigned Products</h5>
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>MRP</th>
                <th>Qty</th>
                <th>Expire Date</th>
              </tr>
            </thead>
            <tbody>
              {assignedProducts.length === 0 && (
                <tr><td colSpan="4" className="text-muted">No products assigned yet.</td></tr>
              )}
              {assignedProducts.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.mrp ?? '-'}</td>
                  <td>{p.quantity}</td>
                  <td>{p.expireDate || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale */}
      <div className="section mb-4">
        <h5>Record Sale</h5>
        <SalesForm
          products={allProducts}
          managers={[manager]}
          managersAll={[]}
          onRecord={(req) => {
            recordSale(req)
              .then(() => { getSalesByManager(manager.id).then(res => setSales(res.data)); alert('Sale recorded'); })
              .catch(e => alert('Error: ' + e));
          }}
        />
      </div>

      {/* Sales History */}
      <div className="section">
        <SalesHistory items={sales} />
      </div>
    </div>
  );
}
