import React, { useState, useEffect } from 'react';

export default function ProductForm({ initial = {}, onCancel, onSave }) {
  const [form, setForm] = useState({
    name: '',
    mrp: '',
    directPrice: '',
    shareOfManager: '',
    shareOfDirectBody: '',
    shareOfCompany: '',
    quantity: 0,
    manufactureDate: '',
    expireDate: '',
    ...initial
  });

  useEffect(() => setForm(f => ({ ...f, ...initial })), [initial]);

  const change = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...form };

    // sanitize numeric/decimal fields: keep empty as undefined so backend will ignore
    ['mrp','directPrice','shareOfManager','shareOfDirectBody','shareOfCompany'].forEach(k => {
      if (payload[k] === '' || payload[k] === null || payload[k] === undefined) delete payload[k];
      ; // keep string/number as-is. Backend accepts numbers or numeric strings for BigDecimal
    });

    payload.quantity = Number(payload.quantity || 0);

    // handle dates
    ['manufactureDate', 'expireDate'].forEach(k => {
      if (payload[k] === '' || payload[k] === null || payload[k] === undefined) delete payload[k];
    });

    onSave(payload);
  };

  return (
    <form className="product-form" onSubmit={submit}>
      <div className="mb-2">
        <label className="form-label">Name</label>
        <input className="form-control" value={form.name || ''} onChange={change('name')} required />
      </div>

      <div className="row">
        <div className="col-md-4 mb-2">
          <label className="form-label">MRP</label>
          <input className="form-control" type="number" step="0.01" value={form.mrp || ''} onChange={change('mrp')} />
        </div>
        <div className="col-md-4 mb-2">
          <label className="form-label">Direct Price</label>
          <input className="form-control" type="number" step="0.01" value={form.directPrice || ''} onChange={change('directPrice')} />
        </div>
        <div className="col-md-4 mb-2">
          <label className="form-label">Quantity</label>
          <input className="form-control" type="number" value={form.quantity || 0} onChange={change('quantity')} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-2">
          <label className="form-label">Manufacture Date</label>
          <input className="form-control" type="date" value={form.manufactureDate || ''} onChange={change('manufactureDate')} />
        </div>
        <div className="col-md-6 mb-2">
          <label className="form-label">Expire Date</label>
          <input className="form-control" type="date" value={form.expireDate || ''} onChange={change('expireDate')} />
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-2">
          <label className="form-label">Share of Manager (%)</label>
          <input className="form-control" type="number" step="0.01" value={form.shareOfManager || ''} onChange={change('shareOfManager')} />
        </div>
        <div className="col-md-4 mb-2">
          <label className="form-label">Share of Direct Body (%)</label>
          <input className="form-control" type="number" step="0.01" value={form.shareOfDirectBody || ''} onChange={change('shareOfDirectBody')} />
        </div>
        <div className="col-md-4 mb-2">
          <label className="form-label">Share of Company (%)</label>
          <input className="form-control" type="number" step="0.01" value={form.shareOfCompany || ''} onChange={change('shareOfCompany')} />
        </div>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}