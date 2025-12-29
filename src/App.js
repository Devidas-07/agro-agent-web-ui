import React from 'react';
import './App.css';
import VerticalNav from './components/VerticalNav';
import TopBar from './components/TopBar';
import Footer from './components/Footer';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import SalesManagers from './pages/SalesManagers';
import SalesHistoryPage from './pages/SalesHistoryPage';

function App() {
  return (
    <div className="d-flex">
      <div style={{width:280}}>
        <VerticalNav />
      </div>
      <div className="flex-grow-1 d-flex flex-column" style={{minHeight:'100vh'}}>
        <TopBar />
        <main className="p-4 flex-fill">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/salesmanagers" element={<SalesManagers />} />
            <Route path="/sales" element={<SalesHistoryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
