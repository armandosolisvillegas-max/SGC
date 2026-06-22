import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage on startup
    const storedToken = localStorage.getItem('sgc_token');
    const storedUser = localStorage.getItem('sgc_user');

    if (storedToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // localStorage had corrupted data — clean it up
        localStorage.removeItem('sgc_token');
        localStorage.removeItem('sgc_user');
      }
    } else if (storedToken || storedUser) {
      // Remove any partial/invalid entries
      localStorage.removeItem('sgc_token');
      localStorage.removeItem('sgc_user');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('sgc_token', data.token);
      localStorage.setItem('sgc_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nombre, email, password, rol) => {
    setError(null);
    setLoading(true);
    try {
      const data = await authApi.registro(nombre, email, password, rol);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('sgc_token', data.token);
      localStorage.setItem('sgc_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sgc_token');
    localStorage.removeItem('sgc_user');
  };

  // Helper roles check
  const hasRole = (roles) => {
    if (!user) return false;
    const userRole = user.rol.toUpperCase();
    if (Array.isArray(roles)) {
      return roles.map(r => r.toUpperCase()).includes(userRole);
    }
    return userRole === roles.toUpperCase();
  };

  const isRole = {
    isAdmin: () => hasRole('ROLE_ADMIN'),
    isCuidador: () => hasRole('ROLE_CUIDADOR'),
    isVeterinario: () => hasRole('ROLE_VETERINARIO'),
    isCliente: () => hasRole('ROLE_CLIENTE'),
    isPotrador: () => hasRole('ROLE_POTRADOR'),
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, hasRole, isRole }}>
      {children}
    </AuthContext.Provider>
  );
};
