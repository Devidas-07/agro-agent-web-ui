import React, { useEffect, useState } from 'react';
import SalesHistory from '../components/SalesHistory';
import SalesForm from '../components/SalesForm';
import { getProducts, getManagers, recordSale, getSales, getSalesByManager, updateSale, deleteSale } from '../api';

export default function SalesHistoryPage() {
  const [products, setProducts]     = useState([]);
  const [managers, setManagers]     = useState([]);
  const [sales, setSales]           = useState([]);
  const [selectedMgr, setSelectedMgr] = useState(null); // full manager object
  const [editing, setEditing]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);

  useEffect(() => {
    getProducts().then(r => setProducts(r.data || [])).catch(console.error);
    getManagers().then(r => setManagers(r.data || [])).catch(console.error);
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try { const r = await getSales(); setSales(r.data || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadByManager = async (mgr) => {
    setLoading(true);
    try { const r = await getSalesByManager(mgr.id); setSales(r.data || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleManagerSelect = (e) => {
    const id = e.target.value;
    if (!id) { setSelectedMgr(null); loadAll(); return; }
    const mgr = managers.find(m => String(m.id) === String(id));
    setSelectedMgr(mgr);
    loadByManager(mgr);
  };

  const handleRecord = async (req) => {
    try {
      await recordSale(req);
      setEditing(null);
      setShowForm(false);
      selectedMgr ? loadByManager(selectedMgr) : loadAll();
      alert('Sale recorded successfully!');
    } catch (e) { alert('Failed to record sale: ' + (e?.response?.data || e.message)); }
  };

  const handleUpdate = async (id, req) => {
    try {
      await updateSale(id, req);
      setEditing(null);
      setShowForm(false);
      selectedMgr ? loadByManager(selectedMgr) : loadAll();
    } catch (e) { alert('Failed to update sale'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this sale record?')) return;
    try {
      await deleteSale(id);
      selectedMgr ? loadByManager(selectedMgr) : loadAll();
    } catch (e) { alert('Failed to delete sale'); }
  };

  const handleEdit = (s) => {
    setEditing({ id: s.id, productId: s.productId, salesManagerId: s.salesManagerId, quantity: s.quantity });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // profit totals for filtered sales
  const profitTotals = sales.reduce((acc, s) => {
    const mrp = Number(s.productMrp ?? 0);
    const qty = Number(s.quantity ?? 0);
    acc.manager    += (Number(s.productShareOfManager    ?? 0) / 100) * mrp * qty;
    acc.directBody += (Number(s.productShareOfDirectBody ?? 0) / 100) * mrp * qty;
    acc.company    += (Number(s.productShareOfCompany    ?? 0) / 100) * mrp * qty;
    return acc;
  }, { manager: 0, directBody: 0, company: 0 });

  const fmt = (v) => {
    try { return Number(v).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }); }
    catch { return '₹' + Number(v).toFixed(2); }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)' }}>📊</div>
        <div>
          <h3>Sales History</h3>
          <p>Track and manage all sales transactions</p>
        </div>
        <div className="ms-auto">
          <button className="btn-agro" onClick={() => { setEditing(null); setShowForm(s => !s); }}>
            {showForm ? '✕ Close Form' : '+ Record Sale'}
          </button>
        </div>
      </div>

      {/* Record / Edit Sale Form */}
      {showForm && (
        <div className="agro-card mb-4">
          <div className="agro-card-header">
            {editing ? '✏️ Edit Sale Record' : '📝 Record New Sale'}
          </div>
          <div style={{ padding: '20px' }}>
            <SalesForm
              products={products}
              managers={managers}
              initial={editing}
              onRecord={handleRecord}
              onUpdate={handleUpdate}
              onCancel={() => { setEditing(null); setShowForm(false); }}
            />
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="agro-card mb-4">
        <div className="agro-card-header">🔍 Filter Sales</div>
        <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label className="agro-label">Filter by Manager</label>
            <select
              className="agro-input"
              value={selectedMgr?.id ?? ''}
              onChange={handleManagerSelect}
            >
              <option value="">— All Managers —</option>
              {managers.map(m => (
                <option key={m.id} value={m.id}>{m.salesManagerName}</option>
              ))}
            </select>
          </div>

          {selectedMgr && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedMgr.salesManagerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1b4332', fontSize: '0.9rem' }}>{selectedMgr.salesManagerName}</div>
                <div style={{ fontSize: '0.75rem', color: '#74a57f' }}>ID: {selectedMgr.id}</div>
              </div>
            </div>
          )}

          {selectedMgr && (
            <button
              className="btn-agro-outline"
              style={{ marginTop: '20px' }}
              onClick={() => { setSelectedMgr(null); loadAll(); }}
            >
              ✕ Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Manager Profile Card — shown only when filtered */}
      {selectedMgr && (
        <div style={{
          background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
          borderRadius: '16px', padding: '20px 24px', marginBottom: '20px',
          color: '#fff', display: 'flex', alignItems: 'center', gap: '20px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontWeight: 700, flexShrink: 0,
          }}>
            {selectedMgr.salesManagerName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedMgr.salesManagerName}</div>
            <div style={{ opacity: 0.75, fontSize: '0.85rem' }}>Sales Manager · ID: {selectedMgr.id}</div>
          </div>

          {/* Profit summary for this manager */}
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Mgr Profit',    value: profitTotals.manager,    icon: '👤' },
              { label: 'Direct Body',   value: profitTotals.directBody,  icon: '🤝' },
              { label: 'Company',       value: profitTotals.company,     icon: '🏢' },
            ].map(pc => (
              <div key={pc.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {pc.icon} {pc.label}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{fmt(pc.value)}</div>
              </div>
            ))}
            <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '24px' }}>
              <div style={{ fontSize: '0.72rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>📋 Records</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sales.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Table */}
      <div className="agro-card">
        <div className="agro-card-header">
          {selectedMgr ? `📋 Sales by ${selectedMgr.salesManagerName}` : '📋 All Sales Records'}
          <span style={{ marginLeft: 'auto', background: '#dcfce7', color: '#166534', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
            {sales.length} record{sales.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ padding: '8px 0' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#74a57f' }}>Loading sales...</div>
          ) : (
            <SalesHistory
              items={sales}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showManager={!selectedMgr}
            />
          )}
        </div>
      </div>
    </div>
  );
}
