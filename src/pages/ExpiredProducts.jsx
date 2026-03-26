import React, { useEffect, useState } from 'react';
import { getExpiredProducts } from '../api';

export default function ExpiredProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpiredProducts()
      .then(res => setItems(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3>Expired Products</h3>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="alert alert-success">No expired products found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-danger">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>MRP</th>
                <th>Quantity</th>
                <th>Manufacture Date</th>
                <th>Expire Date</th>
                <th>Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>₹{item.mrp}</td>
                  <td>{item.quantity}</td>
                  <td>{item.manufactureDate}</td>
                  <td className="text-danger fw-bold">{item.expireDate}</td>
                  <td>{item.expiredAt ? new Date(item.expiredAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
