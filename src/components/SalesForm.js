import React, { useState, useEffect } from 'react';

export default function SalesForm({ products = [], managers = [], initial = null, onRecord, onUpdate, onCancel }) {
  const [form, setForm] = useState({ productId: '', salesManagerId: '', quantity: 1 });

  useEffect(() => {
    setForm(initial
      ? { productId: initial.productId ?? '', salesManagerId: initial.salesManagerId ?? '', quantity: initial.quantity ?? 1 }
      : { productId: '', salesManagerId: '', quantity: 1 }
    );
  }, [initial]);

  const change = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      productId:      Number(form.productId),
      salesManagerId: Number(form.salesManagerId),
      quantity:       Number(form.quantity),
    };
    initial?.id ? onUpdate?.(initial.id, payload) : onRecord?.(payload);
  };

  const isEdit = !!(initial?.id);

  return (
    <form onSubmit={submit}>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="agro-label">Sales Manager</label>
          <select className="agro-input" value={form.salesManagerId} onChange={change('salesManagerId')} required>
            <option value="">— Select Manager —</option>
            {managers.map(m => (
              <option key={m.id} value={m.id}>{m.salesManagerName}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="agro-label">Product</label>
          <select className="agro-input" value={form.productId} onChange={change('productId')} required>
            <option value="">— Select Product —</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} (qty: {p.quantity})</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="agro-label">Quantity</label>
          <input
            className="agro-input"
            type="number"
            min="1"
            value={form.quantity}
            onChange={change('quantity')}
            required
          />
        </div>

        <div className="col-md-2 d-flex align-items-end gap-2">
          <button type="submit" className="btn-agro w-100">
            {isEdit ? '✔ Update' : '📝 Record'}
          </button>
          {isEdit && (
            <button type="button" className="btn-agro-outline" onClick={() => onCancel?.()}>✕</button>
          )}
        </div>
      </div>
    </form>
  );
}
