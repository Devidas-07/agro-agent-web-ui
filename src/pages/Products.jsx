import React, { useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct, searchProducts } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    getProducts()
      .then(res => setProducts(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };

  const search = () => {
    if (!query.trim()) return load();
    searchProducts(query).then(res => setProducts(res.data)).catch(e => console.error(e));
  };

  const save = (p) => {
    const action = editing?.id ? updateProduct(editing.id, p) : createProduct(p);
    action.then(() => { setEditing(null); setShowForm(false); load(); }).catch(e => console.error(e));
  };

  const remove = (id) => {
    if (!window.confirm('Delete this product?')) return;
    deleteProduct(id).then(() => load()).catch(e => console.error(e));
  };

  const today = new Date();
  const isExpired = (d) => d && new Date(d) < today;

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)' }}>🌱</div>
        <div>
          <h3>Products</h3>
          <p>Manage your agriculture product inventory</p>
        </div>
        <div className="ms-auto d-flex gap-2">
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className="agro-input"
              style={{ width: '220px' }}
              placeholder="🔍 Search products..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
            <button className="btn-agro-outline" onClick={search}>Search</button>
          </div>
          <button className="btn-agro" onClick={() => { setEditing(null); setShowForm(true); }}>
            + Add Product
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Product Table */}
        <div className={showForm ? 'col-lg-7' : 'col-12'}>
          <div className="agro-card">
            <div className="agro-card-header">
              🌿 Product Inventory
              <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#166534', padding: '2px 10px', borderRadius: '20px', fontSize: '0.78rem' }}>
                {products.length} items
              </span>
            </div>
            <div style={{ padding: '0' }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#74a57f' }}>Loading products...</div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🌱</div>
                  <p>No products found. Add your first product!</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="agro-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>MRP (₹)</th>
                        <th>Direct Price</th>
                        <th>Qty</th>
                        <th>Expire Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p, idx) => (
                        <tr key={p.id}>
                          <td style={{ color: '#74a57f', fontWeight: 500 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600, color: '#1b4332' }}>{p.name}</td>
                          <td>₹{p.mrp ?? '-'}</td>
                          <td>₹{p.directPrice ?? '-'}</td>
                          <td>
                            <span style={{ background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                              {p.quantity}
                            </span>
                          </td>
                          <td style={{ color: isExpired(p.expireDate) ? '#dc2626' : '#2d3a1e', fontWeight: isExpired(p.expireDate) ? 700 : 400 }}>
                            {p.expireDate || '-'}
                          </td>
                          <td>
                            {isExpired(p.expireDate)
                              ? <span className="badge-expired">⚠ Expired</span>
                              : <span className="badge-active">✓ Active</span>
                            }
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button className="btn-edit-sm" onClick={() => { setEditing(p); setShowForm(true); }}>✏ Edit</button>
                              <button className="btn-danger-sm" onClick={() => remove(p.id)}>🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Panel */}
        {showForm && (
          <div className="col-lg-5">
            <div className="agro-card">
              <div className="agro-card-header">
                {editing ? '✏️ Edit Product' : '➕ Add New Product'}
              </div>
              <div style={{ padding: '20px' }}>
                <ProductForm
                  initial={editing || {}}
                  onCancel={() => { setShowForm(false); setEditing(null); }}
                  onSave={save}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
