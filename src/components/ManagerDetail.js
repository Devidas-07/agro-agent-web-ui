import React, { useState, useEffect } from 'react';
import { getProductsByManager, getProducts, createProduct, updateProduct, deleteProduct, assignProductToManager, getSalesByManager, getSales } from '../api';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

import SalesForm from './SalesForm';
import SalesHistory from './SalesHistory';

export default function ManagerDetail({ manager }) {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [sales, setSales] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (manager) {
      load();
    }
  }, [manager]);

  const load = () => {
    getProductsByManager(manager.id).then(res => setProducts(res.data)).catch(e => console.error(e));
    getProducts().then(res => setAllProducts(res.data)).catch(e => console.error(e));
    getSalesByManager(manager.id).then(res => setSales(res.data)).catch(e => console.error(e));
  };

  const addProduct = (p) => {
    createProduct(p).then(() => { setShowForm(false); load(); }).catch(e => console.error(e));
  };

  const editProduct = (p) => {
    setEditing(p);
    setShowForm(true);
  };

  const saveProduct = (p) => {
    if (editing && editing.id) {
      updateProduct(editing.id, p).then(() => { setEditing(null); setShowForm(false); load(); }).catch(e => console.error(e));
    } else {
      addProduct(p);
    }
  };

  const remove = (id) => {
    if (!window.confirm('Delete product?')) return;
    deleteProduct(id).then(() => load()).catch(e => console.error(e));
  };

  const assign = (p) => {
    const targetId = manager.id;
    assignProductToManager(p.id, targetId).then(() => load()).catch(e => console.error(e));
  };

  return (
    <div className="manager-detail">
      {!manager && <div>Select a manager from the left.</div>}
      {manager && (
        <>
          <div className="manager-header">
            <h2>{manager.salesManagerName}</h2>
            <div>Manager ID: {manager.id}</div>
          </div>

          <div className="section">
            <h3>Products</h3>
            <button onClick={() => { setEditing(null); setShowForm(true); }}>Add product</button>
            <ProductList products={products} onEdit={editProduct} onDelete={remove} onAssign={assign} />
            {showForm && <ProductForm initial={editing || {}} onCancel={() => { setShowForm(false); setEditing(null); }} onSave={saveProduct} />}
          </div>

          <div className="section">
            <h3>Record Sale</h3>
            <SalesForm products={allProducts} managers={[manager]} managersAll={[]} onRecord={(req) => {
              // record using fetch in-line to avoid adding extra import
              import('../api').then(api => api.recordSale(req)).then(() => { getSalesByManager(manager.id).then(res => setSales(res.data)); alert('Sale recorded'); }).catch(e => alert('Error: '+e));
            }} />
          </div>

          <div className="section">
            <SalesHistory items={sales} />
          </div>
        </>
      )}
    </div>
  );
}