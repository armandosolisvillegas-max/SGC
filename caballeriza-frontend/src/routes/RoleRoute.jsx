import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const RoleRoute = ({ children, allowedRoles = [] }) => {
  const { user, hasRole, loading } = useAuth();

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
        <i className="fa-solid fa-circle-notch fa-spin fa-3x"></i>
      </div>
    );
  }

  // Check if role matches
  if (!user || !hasRole(allowedRoles)) {
    console.warn(`Rol denegado: Se requiere alguno de [${allowedRoles}], pero tienes '${user?.rol}'`);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
