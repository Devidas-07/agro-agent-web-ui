import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, updateProduct } from '../api';
import ProductForm from './ProductForm';

export default function ProductList({ onAssign }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getProducts()
      .then(res => setProducts(res.data || []))
      .catch(e => { console.error('Failed to load products', e); setError('Failed to load products'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Delete product?')) return;
    deleteProduct(id)
      .then(() => load())
      .catch(err => alert('Delete failed: ' + (err.message || err)));
  };

  const saveEdit = (payload) => {
    if (!editing) return;
    updateProduct(editing.id, payload)
      .then(() => { setEditing(null); load(); })
      .catch(err => alert('Update failed: ' + (err.message || err)));
  };

  return (
    <div>
      <h5>Products</h5>
      {loading && <div className="text-muted">Loading products...</div>}
      {error && <div className="text-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>MRP</th>
              <th>Direct Price</th>
              <th>Qty</th>
              <th>Share Manager (%)</th>
              <th>Share DirectBody (%)</th>
              <th>Share Company (%)</th>
              <th>Manufacture Date</th>
              <th>Expire Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && !loading && (
              <tr><td colSpan="11" className="text-muted">No products found.</td></tr>
            )}
            {products.map(p => (
              <React.Fragment key={p.id}>
                <tr>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.mrp != null ? p.mrp : '-'}</td>
                  <td>{p.directPrice != null ? p.directPrice : '-'}</td>
                  <td>{p.quantity}</td>
                  <td>{p.shareOfManager != null ? p.shareOfManager : '-'}</td>
                  <td>{p.shareOfDirectBody != null ? p.shareOfDirectBody : '-'}</td>
                  <td>{p.shareOfCompany != null ? p.shareOfCompany : '-'}</td>
                  <td>{p.manufactureDate || '-'}</td>
                  <td>{p.expireDate || '-'}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(p)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                      {onAssign && <button className="btn btn-sm btn-outline-secondary" onClick={() => onAssign(p)}>Assign</button>}
                    </div>
                  </td>
                </tr>
                {editing && editing.id === p.id && (
                  <tr>
                    <td colSpan="11">
                      <div className="p-3 border rounded bg-light">
                        <h6>Edit product: {editing.name}</h6>
                        <ProductForm initial={editing} onCancel={() => setEditing(null)} onSave={saveEdit} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
