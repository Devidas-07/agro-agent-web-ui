import React from 'react';

function fmtCurrency(v) {
  if (v == null || Number.isNaN(Number(v))) return '-';
  try {
    return Number(v).toLocaleString(undefined, { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  } catch (e) {
    return Number(v).toFixed(2);
  }
}

function fmtPercent(p) {
  if (p == null || Number.isNaN(Number(p))) return '-';
  const num = Number(p);
  const value = num > 1 ? num : num; // assume fraction (e.g. 0.10) or absolute
  return (value * 100).toFixed(2) + '%';
}

export default function SalesHistory({ items = [], onView, onEdit, onDelete }) {
  // Normalize items and compute profits
  const rows = items.map(s => {
    const directPrice = Number(s.productDirectPrice ?? s.directPrice ?? 0);
    const quantity = Number(s.quantity ?? 0);
    const shareManager = Number(s.productShareOfManager ?? 0);
    const shareDirectBody = Number(s.productShareOfDirectBody ?? 0);
    const shareCompany = Number(s.productShareOfCompany ?? 0);

    // Defensive: if shares are provided as percentages >1 (like 10), convert to fraction
    const normalizeShare = (x) => (Math.abs(x) > 1 ? x / 100 : x);

    const mShare = normalizeShare(shareManager);
    const dShare = normalizeShare(shareDirectBody);
    const cShare = normalizeShare(shareCompany);

    const managerProfit = directPrice * mShare * quantity;
    const directBodyProfit = directPrice * dShare * quantity;
    const companyProfit = directPrice * cShare * quantity;

    return {
      ...s,
      directPrice,
      quantity,
      mShare,
      dShare,
      cShare,
      managerProfit,
      directBodyProfit,
      companyProfit
    };
  });

  const totals = rows.reduce((acc, r) => {
    acc.managerProfit += r.managerProfit;
    acc.directBodyProfit += r.directBodyProfit;
    acc.companyProfit += r.companyProfit;
    return acc;
  }, { managerProfit: 0, directBodyProfit: 0, companyProfit: 0 });

  return (
    <div className="sales-history">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="m-0">Sales History</h4>
        <div className="text-muted">{items.length} record{items.length !== 1 ? 's' : ''}</div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th className="text-end">MRP</th>
              <th className="text-end">Direct Price</th>
              <th className="text-center">Mgr Share</th>
              <th className="text-end">Mgr Profit</th>
              <th className="text-center">Direct Body Share</th>
              <th className="text-end">Direct Body Profit</th>
              <th className="text-center">Company Share</th>
              <th className="text-end">Company Profit</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>
                  <div className="fw-bold">{r.productName}</div>
                  <div className="text-muted small">Sold by: {r.salesManagerName ?? '-'}</div>
                </td>
                <td className="text-end">{fmtCurrency(r.productMrp ?? r.mrp)}</td>
                <td className="text-end">{fmtCurrency(r.directPrice)}</td>
                <td className="text-center">{fmtPercent(r.mShare)}</td>
                <td className="text-end">{fmtCurrency(r.managerProfit)}</td>
                <td className="text-center">{fmtPercent(r.dShare)}</td>
                <td className="text-end">{fmtCurrency(r.directBodyProfit)}</td>
                <td className="text-center">{fmtPercent(r.cShare)}</td>
                <td className="text-end">{fmtCurrency(r.companyProfit)}</td>
                <td className="text-center">{r.quantity}</td>
                <td className="text-center">
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-outline-primary" onClick={() => onView && onView(r)}>View</button>
                    <button className="btn btn-outline-secondary" onClick={() => onEdit && onEdit(r)}>Edit</button>
                    <button className="btn btn-outline-danger" onClick={() => { if (window.confirm('Delete sale?')) onDelete && onDelete(r.id); }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-dark">
              <th>Total</th>
              <th></th>
              <th></th>
              <th></th>
              <th className="text-end">{fmtCurrency(totals.managerProfit)}</th>
              <th></th>
              <th className="text-end">{fmtCurrency(totals.directBodyProfit)}</th>
              <th></th>
              <th className="text-end">{fmtCurrency(totals.companyProfit)}</th>
              <th></th>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
