import React, { useEffect, useState } from 'react';
import { getExpiredProducts, getExpiredFromProducts } from '../api';

export default function ExpiredProducts() {
  const [movedItems, setMovedItems] = useState([]);
  const [stillInProducts, setStillInProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExpiredProducts(), getExpiredFromProducts()])
      .then(([expiredRes, productsRes]) => {
        setMovedItems(expiredRes.data || []);
        setStillInProducts(productsRes.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalCount = movedItems.length + stillInProducts.length;

  const daysOverdue = (expireDate) => {
    if (!expireDate) return '-';
    return Math.floor((new Date() - new Date(expireDate)) / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)' }}>⚠️</div>
        <div>
          <h3>Expired Products</h3>
          <p>Track products past their expiry date</p>
        </div>
        {!loading && totalCount > 0 && (
          <div className="ms-auto">
            <span style={{ background: '#fee2e2', color: '#dc2626', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.9rem' }}>
              ⚠ {totalCount} expired
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="agro-card" style={{ padding: '48px', textAlign: 'center', color: '#74a57f' }}>
          Loading expired products...
        </div>
      ) : totalCount === 0 ? (
        <div className="agro-card">
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <h5 style={{ color: '#166534', fontWeight: 600 }}>All Clear!</h5>
            <p>No expired products found. Your inventory is in good shape.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Section 1 — Moved during assign */}
          {movedItems.length > 0 && (
            <div className="agro-card mb-4">
              <div className="agro-card-header" style={{ background: 'linear-gradient(135deg, #fee2e2, #fecaca)', color: '#991b1b' }}>
                🚫 Blocked During Assignment
                <span style={{ marginLeft: 'auto', background: '#dc2626', color: '#fff', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
                  {movedItems.length}
                </span>
              </div>
              <div style={{ padding: '4px 0' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="agro-table">
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #991b1b, #dc2626)' }}>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>MRP (₹)</th>
                        <th>Quantity</th>
                        <th>Manufacture Date</th>
                        <th>Expire Date</th>
                        <th>Moved At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movedItems.map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ color: '#74a57f' }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600, color: '#1b4332' }}>{item.name}</td>
                          <td>{item.mrp != null ? `₹${item.mrp}` : '-'}</td>
                          <td>{item.quantity}</td>
                          <td>{item.manufactureDate || '-'}</td>
                          <td><span className="badge-expired">⚠ {item.expireDate}</span></td>
                          <td style={{ color: '#74a57f', fontSize: '0.82rem' }}>
                            {item.expiredAt ? new Date(item.expiredAt).toLocaleString('en-IN') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Section 2 — Still in products table */}
          {stillInProducts.length > 0 && (
            <div className="agro-card">
              <div className="agro-card-header" style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#92400e' }}>
                ⏰ Still in Inventory (Expiry Passed)
                <span style={{ marginLeft: 'auto', background: '#d97706', color: '#fff', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
                  {stillInProducts.length}
                </span>
              </div>
              <div style={{ padding: '4px 0' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="agro-table">
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, #92400e, #d97706)' }}>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>MRP (₹)</th>
                        <th>Quantity</th>
                        <th>Manufacture Date</th>
                        <th>Expire Date</th>
                        <th>Days Overdue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stillInProducts.map((item, idx) => (
                        <tr key={item.id}>
                          <td style={{ color: '#74a57f' }}>{idx + 1}</td>
                          <td style={{ fontWeight: 600, color: '#1b4332' }}>{item.name}</td>
                          <td>{item.mrp != null ? `₹${item.mrp}` : '-'}</td>
                          <td>{item.quantity}</td>
                          <td>{item.manufactureDate || '-'}</td>
                          <td><span className="badge-expired">⚠ {item.expireDate}</span></td>
                          <td>
                            <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.8rem' }}>
                              {daysOverdue(item.expireDate)} days
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
