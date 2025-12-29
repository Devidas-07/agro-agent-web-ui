import React, { useState, useEffect } from 'react';

export default function SalesForm({ products = [], managers = [], initial = {}, onRecord, onUpdate, onCancel }) {
  const [form, setForm] = useState({ productId: '', salesManagerId: '', quantity: 1, ...initial });

  useEffect(() => {
    setForm({ productId: '', salesManagerId: '', quantity: 1, ...initial });
  }, [initial]);

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const payload = { productId: Number(form.productId), salesManagerId: Number(form.salesManagerId), quantity: Number(form.quantity) };
    if (initial && initial.id && onUpdate) {
      onUpdate(initial.id, payload);
    } else {
      onRecord && onRecord(payload);
    }
  };

  return (
    <form className="sales-form" onSubmit={submit}>
       <div>
        <label>Sales Manager</label>
        <select value={form.salesManagerId} onChange={change('salesManagerId')} required>
          <option value="">-- select --</option>
          {managers.map(m => <option key={m.id} value={m.id}>{m.salesManagerName}</option>)}
        </select>
      </div>
      <div>
        <label>Product</label>
        <select value={form.productId} onChange={change('productId')} required>
          <option value="">-- select --</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name} (qty:{p.quantity})</option>)}
        </select>
      </div>
     
      <div>
        <label>Quantity</label>
        <input type="number" min="1" value={form.quantity} onChange={change('quantity')} required />
      </div>
      <div>
        {initial && initial.id ? (
          <>
            <button type="submit">Update Sale</button>
            <button type="button" onClick={() => onCancel && onCancel()} style={{ marginLeft: 8 }}>Cancel</button>
          </>
        ) : (
          <button type="submit">Record Sale</button>
        )}
      </div>
    </form>
  );
} 