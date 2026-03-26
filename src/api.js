import axios from 'axios';

const base = process.env.REACT_APP_API_URL || '/api'; // use proxy in development or env var for production
const api = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Sales Managers
export const getManagers = () => api.get('/salesmanagers');
export const createManager = (m) => api.post('/salesmanagers', m);
export const updateManager = (id, m) => api.put(`/salesmanagers/${id}`, m);
export const deleteManager = (id) => api.delete(`/salesmanagers/${id}`);
export const getManager = (id) => api.get(`/salesmanagers/${id}`);

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (p) => api.post('/products', p);
export const updateProduct = (id, p) => api.put(`/products/${id}`, p);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const assignProductToManager = (productId, managerId) => api.put(`/products/${productId}/assign/${managerId}`);
export const searchProducts = (name) => api.get(`/products/search?name=${encodeURIComponent(name)}`);
export const getProductsByManager = (managerId) => api.get(`/products/by-manager/${managerId}`);

// Sales
export const recordSale = (req) => api.post('/sales', req);
export const getSales = () => api.get('/sales');
export const getSalesByManager = (managerId) => api.get(`/sales/manager/${managerId}`);
export const getSalesByProduct = (productId) => api.get(`/sales/product/${productId}`);
// single sale / updates / deletes
export const getSale = (id) => api.get(`/sales/${id}`);
export const updateSale = (id, req) => api.put(`/sales/${id}`, req);
export const deleteSale = (id) => api.delete(`/sales/${id}`);

// Expired Products
export const getExpiredProducts = () => api.get('/expired-products');

// Auth
export const login = (username, password) => api.post('/auth/login', { username, password });
export const logout = () => api.post('/auth/logout');
export const authStatus = () => api.get('/auth/status');

export default api;