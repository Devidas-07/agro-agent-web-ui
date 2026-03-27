import React, { useState } from 'react';
import { login } from '../api';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 40%, #40916c 70%, #74c69d 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute', top: '-80px', left: '-80px',
    width: '320px', height: '320px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
  },
  blob2: {
    position: 'absolute', bottom: '-100px', right: '-60px',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
  },
  blob3: {
    position: 'absolute', top: '40%', left: '30%',
    width: '200px', height: '200px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.03)',
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px',
    color: '#fff',
    position: 'relative',
    zIndex: 1,
  },
  right: {
    width: '460px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    background: 'rgba(255,255,255,0.97)',
    borderRadius: '24px',
    padding: '40px 36px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(10px)',
  },
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      {/* Left panel */}
      <div style={styles.left}>
        <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🌾</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          AgroAgent
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.85, maxWidth: '360px', textAlign: 'center', lineHeight: 1.6 }}>
          Smart agriculture management platform for tracking products, sales managers, and distribution.
        </p>
        <div style={{ display: 'flex', gap: '32px', marginTop: '40px' }}>
          {[['🌱', 'Products'], ['👥', 'Managers'], ['📊', 'Sales'], ['⚠️', 'Expiry']].map(([icon, label]) => (
            <div key={label} style={{ textAlign: 'center', opacity: 0.85 }}>
              <div style={{ fontSize: '1.8rem' }}>{icon}</div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px', letterSpacing: '0.5px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Decorative farm illustration using CSS */}
        <div style={{ marginTop: '48px', display: 'flex', gap: '8px', alignItems: 'flex-end', opacity: 0.5 }}>
          {[40, 60, 35, 70, 45, 55, 30, 65, 50].map((h, i) => (
            <div key={i} style={{
              width: '12px', height: `${h}px`,
              background: 'rgba(255,255,255,0.6)',
              borderRadius: '6px 6px 2px 2px',
            }} />
          ))}
        </div>
        <div style={{ width: '200px', height: '3px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px', marginTop: '4px' }} />
      </div>

      {/* Right panel — login form */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #1b4332, #40916c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', margin: '0 auto 14px',
              boxShadow: '0 4px 16px rgba(45,106,79,0.35)',
            }}>🌿</div>
            <h2 style={{ fontWeight: 700, color: '#1b4332', marginBottom: '4px' }}>Welcome Back</h2>
            <p style={{ color: '#74a57f', fontSize: '0.88rem' }}>Sign in to your admin account</p>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b',
              padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem',
              marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label className="agro-label">Username</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>👤</span>
                <input
                  className="agro-input"
                  style={{ paddingLeft: '38px' }}
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="agro-label">Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔒</span>
                <input
                  className="agro-input"
                  style={{ paddingLeft: '38px', paddingRight: '44px' }}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: 0,
                  }}
                >{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#74a57f' : 'linear-gradient(135deg, #1b4332, #40916c)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(45,106,79,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Signing in...
                </>
              ) : '🌾 Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.78rem', color: '#74a57f' }}>
            AgroAgent Admin Portal • Secure Access
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
