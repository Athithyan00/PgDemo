// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, isInitializing, logout } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#ffffff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="btn-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem auto' }}></div>
          <p>Verifying Security Credentials...</p>
        </div>
      </div>
    );
  }

  // Check authentication status
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role permission access
  const hasAccess = Array.isArray(allowedRoles)
    ? allowedRoles.includes(user.role)
    : user.role === allowedRoles;

  if (!hasAccess) {
    const userTargetDashboard = `/${user.role}/dashboard`;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}>
        <div style={{
          maxWidth: '480px',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto'
          }}>
            <ShieldAlert size={36} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            Access Denied
          </h2>
          
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            Your account role (<strong>{user.roleTitle || user.role}</strong>) does not have authorization to view this route.
          </p>

          <div style={{
            backgroundColor: '#f1f5f9',
            padding: '1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            color: '#334155',
            marginBottom: '1.75rem',
            textAlign: 'left'
          }}>
            <div><strong>Logged in as:</strong> {user.name} ({user.username})</div>
            <div><strong>Assigned Portal:</strong> {user.role.toUpperCase()} Portal</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={userTargetDashboard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1.25rem',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.95rem'
              }}
            >
              <ArrowLeft size={18} /> Return to My {user.role.toUpperCase()} Dashboard
            </a>

            <button
              type="button"
              onClick={logout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                backgroundColor: 'transparent',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} /> Logout & Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
