import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0b0f19',
        color: '#f59e0b'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ marginBottom: '1rem' }}></i>
          <p style={{ fontFamily: 'Outfit, sans-serif' }}>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
