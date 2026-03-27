import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getManagers, getSales, getExpiredProducts, getExpiredFromProducts } from '../api';

function fmtCurrency(v) {
  if (!v && v !== 0) return '₹0';
  try {
    return Number(v).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
  } catch {
    return '₹' + Number(v).toFixed(2);
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, managers: 0, sales: 0, expired: 0 });
  const [profits, setProfits] = useState({ manager: 0, directBody: 0, company: 0 });

  useEffect(() => {
    Promise.allSettled([
      getProducts(),
      getManagers(),
      getSales(),
      getExpiredProducts(),
      getExpiredFromProducts(),
    ]).then(([p, m, s, e1, e2]) => {
      // counts
      const expiredMoved = e1.status === 'fulfilled' ? e1.value.data.length : 0;
      const expiredStill = e2.status === 'fulfilled' ? e2.value.data.length : 0;

      setStats({
        products: p.status === 'fulfilled' ? p.value.data.length : 0,
        managers: m.status === 'fulfilled' ? m.value.data.length : 0,
        sales:    s.status === 'fulfilled' ? s.value.data.length : 0,
        expired:  expiredMoved + expiredStill,
      });

      // profit calculation from sales — same formula as SalesHistory.jsx
      // profit = (share% / 100) × mrp × quantity
      if (s.status === 'fulfilled') {
        const totals = s.value.data.reduce((acc, sale) => {
          const mrp      = Number(sale.productMrp ?? 0);
          const qty      = Number(sale.quantity   ?? 0);
          const mShare   = Number(sale.productShareOfManager    ?? 0);
          const dShare   = Number(sale.productShareOfDirectBody ?? 0);
          const cShare   = Number(sale.productShareOfCompany    ?? 0);
          acc.manager    += (mShare / 100) * mrp * qty;
          acc.directBody += (dShare / 100) * mrp * qty;
          acc.company    += (cShare / 100) * mrp * qty;
          return acc;
        }, { manager: 0, directBody: 0, company: 0 });
        setProfits(totals);
      }
    });
  }, []);

  const statCards = [
    { to: '/products',         label: 'Total Products',   value: stats.products, icon: '🌱', cls: 'stat-green', desc: 'Active products in inventory' },
    { to: '/salesmanagers',    label: 'Sales Managers',   value: stats.managers, icon: '👥', cls: 'stat-teal',  desc: 'Registered field managers'   },
    { to: '/sales',            label: 'Sales Records',    value: stats.sales,    icon: '📊', cls: 'stat-amber', desc: 'Total transactions recorded'  },
    { to: '/expired-products', label: 'Expired Products', value: stats.expired,  icon: '⚠️', cls: 'stat-red',   desc: 'Products past expiry date'    },
  ];

  const profitCards = [
    { label: 'Manager Profit',     value: profits.manager,    icon: '👤', color: '#2d6a4f', bg: '#dcfce7' },
    { label: 'Direct Body Profit', value: profits.directBody, icon: '🤝', color: '#0369a1', bg: '#e0f2fe' },
    { label: 'Company Profit',     value: profits.company,    icon: '🏢', color: '#b45309', bg: '#fef3c7' },
  ];

  const quickActions = [
    { to: '/products',         icon: '🌱', label: 'Add Product',  desc: 'Register a new agro product'   },
    { to: '/salesmanagers',    icon: '👤', label: 'Add Manager',  desc: 'Onboard a new sales manager'   },
    { to: '/sales',            icon: '📝', label: 'Record Sale',  desc: 'Log a new sales transaction'   },
    { to: '/expired-products', icon: '🔍', label: 'View Expired', desc: 'Check expired product records' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
        borderRadius: '20px', padding: '28px 32px', marginBottom: '28px',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', fontSize: '6rem', opacity: 0.12 }}>🌾</div>
        <div style={{ position: 'absolute', right: '140px', top: '10px', fontSize: '3rem', opacity: 0.08 }}>🌿</div>
        <h2 style={{ fontWeight: 700, marginBottom: '6px' }}>Good {getGreeting()}, Admin! 👋</h2>
        <p style={{ opacity: 0.8, marginBottom: 0, fontSize: '0.95rem' }}>
          Here's what's happening with your agriculture business today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {statCards.map(c => (
          <div className="col-sm-6 col-xl-3" key={c.to}>
            <Link to={c.to} className={`stat-card ${c.cls}`}>
              <div className="stat-card-bg">{c.icon}</div>
              <div className="stat-card-label">{c.label}</div>
              <div className="stat-card-value">{c.value}</div>
              <div className="stat-card-desc">{c.desc}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Overall Profit Summary */}
      <div className="agro-card mb-4">
        <div className="agro-card-header">💰 Overall Profit Summary (calculated on MRP)</div>
        <div style={{ padding: '20px' }}>
          <div className="row g-3">
            {profitCards.map(pc => (
              <div className="col-md-4" key={pc.label}>
                <div style={{
                  background: pc.bg, borderRadius: '14px',
                  padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                  border: `1.5px solid ${pc.bg}`,
                }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '12px',
                    background: pc.color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                  }}>{pc.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: pc.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {pc.label}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: pc.color, lineHeight: 1.2 }}>
                      {fmtCurrency(pc.value)}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#74a57f', marginTop: '2px' }}>
                      across {stats.sales} sale{stats.sales !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total combined profit */}
          <div style={{
            marginTop: '16px', padding: '14px 20px',
            background: 'linear-gradient(135deg, #1b4332, #2d6a4f)',
            borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            color: '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>📈</span>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Total Distributed Profit</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              {fmtCurrency(profits.manager + profits.directBody + profits.company)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="agro-card mb-4">
        <div className="agro-card-header">⚡ Quick Actions</div>
        <div className="row g-0">
          {quickActions.map((a, i) => (
            <div className="col-sm-6 col-lg-3" key={a.to}>
              <Link to={a.to} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '20px', textAlign: 'center',
                  borderRight: i < 3 ? '1px solid #e8f0e0' : 'none',
                  transition: 'background 0.15s', cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f4f7f0'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{a.icon}</div>
                  <div style={{ fontWeight: 600, color: '#1b4332', fontSize: '0.9rem' }}>{a.label}</div>
                  <div style={{ color: '#74a57f', fontSize: '0.78rem', marginTop: '4px' }}>{a.desc}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="agro-card">
        <div className="agro-card-header">💡 Tips</div>
        <div style={{ padding: '16px 20px' }}>
          <div className="row g-3">
            {[
              { icon: '🌾', tip: 'Assign products to managers before the expiry date to avoid automatic removal.' },
              { icon: '📅', tip: 'Check the Expired Products page regularly to track products past their shelf life.' },
              { icon: '📊', tip: 'Use Sales History to monitor manager performance and product movement.' },
            ].map((t, i) => (
              <div className="col-md-4" key={i}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.4rem' }}>{t.icon}</span>
                  <p style={{ fontSize: '0.83rem', color: '#4a6741', margin: 0, lineHeight: 1.5 }}>{t.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}
