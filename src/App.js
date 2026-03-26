import React, { useState, useEffect } from 'react';
import './App.css';
import VerticalNav from './components/VerticalNav';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import SalesManagers from './pages/SalesManagers';
import SalesHistoryPage from './pages/SalesHistoryPage';
import ExpiredProducts from './pages/ExpiredProducts';
import Login from './pages/Login';
import { authStatus, logout } from './api';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    authStatus()
      .then(res => setLoggedIn(res.data.loggedIn === true))
      .catch(() => setLoggedIn(false))
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = () => {
    logout().finally(() => setLoggedIn(false));
  };

  if (checking) return null;

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="d-flex">
      <div style={{ width: 280 }}>
        <VerticalNav />
      </div>
      <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
        <TopBar onLogout={handleLogout} />
        <main className="p-4 flex-fill">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/salesmanagers" element={<SalesManagers />} />
            <Route path="/sales" element={<SalesHistoryPage />} />
            <Route path="/expired-products" element={<ExpiredProducts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
