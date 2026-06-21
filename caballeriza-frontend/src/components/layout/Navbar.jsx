import React, { useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import { alertaApi } from '../../api/apiModules';

export const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadAlerts = async () => {
    try {
      const data = await alertaApi.getAll({ leida: 'false' });
      setAlerts(data);
    } catch (e) {
      console.error("Error al cargar alertas:", e);
    }
  };

  useEffect(() => {
    fetchUnreadAlerts();
    // Poll alerts every 15 seconds to simulate real-time updates
    const interval = setInterval(fetchUnreadAlerts, 15000);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await alertaApi.markAsRead(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const getAlertIcon = (tipo) => {
    switch (tipo) {
      case 'stock_bajo': return 'fa-solid fa-box-open text-warning';
      case 'vacuna_proxima': return 'fa-solid fa-syringe text-info';
      case 'tratamiento_vence': return 'fa-solid fa-prescription-bottle-medical text-error';
      default: return 'fa-solid fa-bell text-gold';
    }
  };

  return (
    <nav style={{
      height: '70px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Mobile Burger Menu Button */}
      <button 
        onClick={onMenuToggle}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '1.25rem',
          cursor: 'pointer',
          display: 'none'
        }}
        className="mobile-burger-btn"
      >
        <i className="fa-solid fa-bars"></i>
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'Playfair Display' }}>
          Sistema <span style={{ color: 'var(--accent-gold)' }}>Gestión Caballeriza</span>
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Notifications Bell Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              position: 'relative',
              padding: '0.5rem',
              borderRadius: '50%',
              transition: 'var(--transition-fast)'
            }}
            className="navbar-icon-btn"
          >
            <i className="fa-regular fa-bell"></i>
            {alerts.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: 'var(--color-error)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '50px',
                lineHeight: 1
              }}>
                {alerts.length}
              </span>
            )}
          </button>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: '320px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              marginTop: '0.5rem',
              overflow: 'hidden',
              animation: 'slideUp 0.2s ease-out'
            }}>
              <div style={{
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.02)'
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Alertas y Notificaciones</span>
                <span className="badge badge-info">{alerts.length} Nuevas</span>
              </div>
              <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                {alerts.length > 0 ? (
                  alerts.map(alert => (
                    <div key={alert.id} style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      transition: 'var(--transition-fast)'
                    }} className="alert-item">
                      <i className={getAlertIcon(alert.tipo)} style={{ marginTop: '0.2rem', fontSize: '0.95rem' }}></i>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {alert.mensaje}
                        </p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{alert.fecha}</span>
                      </div>
                      <button 
                        onClick={() => handleMarkAsRead(alert.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          padding: '2px'
                        }}
                        title="Marcar como leída"
                      >
                        <i className="fa-solid fa-check hover:text-success"></i>
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <i className="fa-solid fa-circle-check fa-lg" style={{ color: 'var(--color-success)', marginBottom: '0.5rem', display: 'block' }}></i>
                    <p style={{ fontSize: '0.85rem', margin: 0 }}>No tienes notificaciones pendientes</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.nombre}</div>
              <span className="badge badge-success" style={{ fontSize: '0.65rem', padding: '1px 8px' }}>
                {user.rol}
              </span>
            </div>
            <button 
              onClick={logout}
              className="btn btn-secondary"
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}
              title="Cerrar Sesión"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        )}
      </div>

      <style>{`
        .navbar-icon-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .alert-item:hover {
          background-color: rgba(255, 255, 255, 0.02);
        }
        .hover\\:text-success:hover {
          color: var(--color-success) !important;
        }
        @media (max-width: 768px) {
          .mobile-burger-btn {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
