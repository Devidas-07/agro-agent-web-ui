import React, { useEffect, useState } from 'react';
import SalesHistory from '../components/SalesHistory';
import SalesForm from '../components/SalesForm';
import { getProducts, getManagers, recordSale, getSales, getSalesByManager, getSalesByProduct, getSale, updateSale, deleteSale } from '../api';

export default function SalesHistoryPage() {
  const [products, setProducts] = useState([]);
  const [managers, setManagers] = useState([]);
  const [sales, setSales] = useState([]);
  const [filter, setFilter] = useState({ productId: '', managerId: '' });
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [singleId, setSingleId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
    loadManagers();
    loadAllSales();
  }, []);

  const loadProducts = async () => {
    try { const res = await getProducts(); setProducts(res.data || []); } catch (e) { console.error(e); }
  };
  const loadManagers = async () => {
    try { const res = await getManagers(); setManagers(res.data || []); } catch (e) { console.error(e); }
  };
  const loadAllSales = async () => {
    try { setLoading(true); const res = await getSales(); setSales(res.data || []); setLoading(false); } catch (e) { setLoading(false); console.error(e); }
  };

  const applyFilter = async () => {
    try {
      setLoading(true);
      if (filter.managerId) {
        const res = await getSalesByManager(filter.managerId);
        setSales(res.data || []);
      } else if (filter.productId) {
        const res = await getSalesByProduct(filter.productId);
        setSales(res.data || []);
      } else {
        await loadAllSales();
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleRecord = async (req) => {
    try { await recordSale(req); setEditing(null); setSelected(null); await applyFilter(); } catch (e) { console.error(e); alert('Failed to record sale: '+(e?.response?.data || e.message)); }
  };
  const handleUpdate = async (id, req) => {
    try { await updateSale(id, req); setEditing(null); setSelected(null); await applyFilter(); } catch (e) { console.error(e); alert('Failed to update sale'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete sale?')) return;
    try { await deleteSale(id); if (selected && selected.id === id) setSelected(null); await applyFilter(); } catch (e) { console.error(e); alert('Failed to delete sale'); }
  };

  const handleView = (s) => { setSelected(s); };
  const handleEdit = (s) => { setEditing({ id: s.id, productId: s.productId, salesManagerId: s.salesManagerId, quantity: s.quantity }); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const fetchById = async () => {
    if (!singleId) return;
    try { setLoading(true); const res = await getSale(singleId); setSales([res.data]); setSelected(res.data); setLoading(false); } catch (e) { setLoading(false); alert('Sale not found'); }
  };

  return (
    <div>
      <h3>Sales History</h3>
      <div className="row">
        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-body">
              <SalesForm
                products={products}
                managers={managers}
                initial={editing}
                onRecord={handleRecord}
                onUpdate={handleUpdate}
                onCancel={() => setEditing(null)}
              />
              <hr />
              <div className="mb-2">
                <label>Filter by Manager</label>
                <select value={filter.managerId} onChange={e => setFilter({ ...filter, managerId: e.target.value, productId: '' })}>
                  <option value="">-- all --</option>
                  {managers.map(m => <option key={m.id} value={m.id}>{m.salesManagerName}</option>)}
                </select>
                <label style={{ marginLeft: '8px' }}>Filter by Product</label>
                <select value={filter.productId} onChange={e => setFilter({ ...filter, productId: e.target.value, managerId: '' })}>
                  <option value="">-- all --</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button onClick={applyFilter} style={{ marginLeft: '8px' }}>Apply</button>
                <button onClick={loadAllSales} style={{ marginLeft: '8px' }}>Show all</button>
              </div>
              <div>
                <label>Load by ID</label>
                <input value={singleId} onChange={e => setSingleId(e.target.value)} placeholder="sale id" />
                <button onClick={fetchById}>Load</button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card mb-3">
            <div className="card-body">
              {loading && <div>Loading...</div>}
              <SalesHistory items={sales} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
              {selected && (
                <div className="card mt-3">
                  <div className="card-body">
                    <h5>Sale Details</h5>
                    <div><strong>ID:</strong> {selected.id}</div>
                    <div><strong>Product:</strong> {selected.productName} (id: {selected.productId})</div>
                    <div><strong>Manager:</strong> {selected.salesManagerName} (id: {selected.salesManagerId})</div>
                    <div><strong>Quantity:</strong> {selected.quantity}</div>
                    <div><strong>Product stock:</strong> {selected.productQuantity}</div>
                    <div><strong>MRP:</strong> {selected.productMrp}</div>
                    <div><strong>Recorded at:</strong> {selected.createdAt && new Date(selected.createdAt).toLocaleString()}</div>
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => setEditing({ id: selected.id, productId: selected.productId, salesManagerId: selected.salesManagerId, quantity: selected.quantity })}>Edit</button>
                      <button onClick={() => handleDelete(selected.id)} style={{ marginLeft: 8 }}>Delete</button>
                      <button onClick={() => setSelected(null)} style={{ marginLeft: 8 }}>Close</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
