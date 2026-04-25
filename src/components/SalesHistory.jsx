import React from 'react';

function fmtCurrency(v) {
  if (v == null || Number.isNaN(Number(v))) return '-';
  try {
    return Number(v).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  } catch (e) {
    return '₹' + Number(v).toFixed(2);
  }
}

export default function SalesHistory({ items = [], onEdit, onDelete, showManager = true }) {
  const rows = items.map(s => {
    const mrp      = Number(s.productMrp ?? s.mrp ?? 0);
    const quantity = Number(s.quantity ?? 0);
    const shareManager    = Number(s.productShareOfManager    ?? 0);
    const shareDirectBody = Number(s.productShareOfDirectBody ?? 0);
    const shareCompany    = Number(s.productShareOfCompany    ?? 0);

    // profit = (share% / 100) × mrp × quantity
    const managerProfit    = (shareManager    / 100) * mrp * quantity;
    const directBodyProfit = (shareDirectBody / 100) * mrp * quantity;
    const companyProfit    = (shareCompany    / 100) * mrp * quantity;

    return { ...s, mrp, quantity, shareManager, shareDirectBody, shareCompany, managerProfit, directBodyProfit, companyProfit };
  });

  const totals = rows.reduce((acc, r) => {
    acc.managerProfit    += r.managerProfit;
    acc.directBodyProfit += r.directBodyProfit;
    acc.companyProfit    += r.companyProfit;
    return acc;
  }, { managerProfit: 0, directBodyProfit: 0, companyProfit: 0 });

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📋</div>
        <h5 style={{ color: '#1b4332', fontWeight: 600 }}>No Sales Records</h5>
        <p>No sales found{showManager ? '' : ' for this manager'}. Record a sale to get started.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="agro-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            {showManager && <th>Manager</th>}
            <th className="text-end">MRP (Base)</th>
            <th className="text-center">Mgr %</th>
            <th className="text-end">Mgr Profit</th>
            <th className="text-center">Direct Body %</th>
            <th className="text-end">Direct Body Profit</th>
            <th className="text-center">Company %</th>
            <th className="text-end">Company Profit</th>
            <th className="text-center">Qty</th>
            <th className="text-center">Date</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id}>
              <td style={{ color: '#74a57f', fontWeight: 500 }}>{idx + 1}</td>
              <td>
                <div style={{ fontWeight: 600, color: '#1b4332' }}>{r.productName}</div>
              </td>
              {showManager && (
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2d6a4f, #40916c)',
                      color: '#fff', fontWeight: 700, fontSize: '0.75rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {(r.salesManagerName ?? 'M').charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.85rem' }}>{r.salesManagerName ?? '-'}</span>
                  </div>
                </td>
              )}
              <td style={{ textAlign: 'right' }}>{fmtCurrency(r.mrp)}</td>
              <td style={{ textAlign: 'center' }}>
                <span className="badge-active">{r.shareManager}%</span>
              </td>
              <td style={{ textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                {fmtCurrency(r.managerProfit)}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {r.shareDirectBody}%
                </span>
              </td>
              <td style={{ textAlign: 'right', color: '#0369a1' }}>{fmtCurrency(r.directBodyProfit)}</td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                  {r.shareCompany}%
                </span>
              </td>
              <td style={{ textAlign: 'right', color: '#d97706' }}>{fmtCurrency(r.companyProfit)}</td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ background: '#f0fdf4', color: '#166534', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                  {r.quantity}
                </span>
              </td>
              <td style={{ textAlign: 'center', fontSize: '0.78rem', color: '#74a57f' }}>
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-'}
              </td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  <button className="btn-edit-sm" onClick={() => onEdit && onEdit(r)}>✏</button>
                  <button className="btn-danger-sm" onClick={() => { if (window.confirm('Delete sale?')) onDelete && onDelete(r.id); }}>🗑</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: 'linear-gradient(135deg, #1b4332, #2d6a4f)', color: '#fff' }}>
            <th colSpan={showManager ? 5 : 4} style={{ padding: '12px 14px' }}>📈 Totals</th>
            <th style={{ textAlign: 'right', padding: '12px 14px' }}>{fmtCurrency(totals.managerProfit)}</th>
            <th></th>
            <th style={{ textAlign: 'right', padding: '12px 14px' }}>{fmtCurrency(totals.directBodyProfit)}</th>
            <th></th>
            <th style={{ textAlign: 'right', padding: '12px 14px' }}>{fmtCurrency(totals.companyProfit)}</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
