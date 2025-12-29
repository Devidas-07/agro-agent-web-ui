import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct, searchProducts } from '../api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    getProducts().then(res => setProducts(res.data)).catch(e => console.error(e));
  };

  const search = () => {
    if (!query.trim()) return load();
    searchProducts(query).then(res => setProducts(res.data)).catch(e => console.error(e));
  };

  const save = (p) => {
    if (editing && editing.id) {
      updateProduct(editing.id, p).then(() => { setEditing(null); setShowForm(false); load(); }).catch(e => console.error(e));
    } else {
      createProduct(p).then(() => { setShowForm(false); load(); }).catch(e => console.error(e));
    }
  };

  const remove = (id) => {
    if (!window.confirm('Delete product?')) return;
    deleteProduct(id).then(() => load()).catch(e => console.error(e));
  };

  const edit = (p) => { setEditing(p); setShowForm(true); };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Products</h3>
        <div className="d-flex gap-2">
          <input placeholder="Search by name" className="form-control" style={{width:220}} value={query} onChange={e => setQuery(e.target.value)} />
          <button className="btn btn-outline-primary" onClick={search}>Search</button>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Add Product</button>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-7">
          <div className="card mb-3">
            <div className="card-body">
              <ProductList products={products} onEdit={edit} onDelete={remove} />
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card mb-3">
            <div className="card-body">
              {showForm ? <ProductForm initial={editing || {}} onCancel={() => { setShowForm(false); setEditing(null); }} onSave={save} /> : <div className="text-muted">Select a product to edit or click Add Product.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}