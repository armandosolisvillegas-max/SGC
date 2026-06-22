import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, hasRole } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Inicio / Dashboard', icon: 'fa-solid fa-gauge-high', roles: ['ROLE_ADMIN', 'ROLE_VETERINARIO', 'ROLE_CUIDADOR', 'ROLE_CLIENTE', 'ROLE_POTRADOR'] },
    { path: '/caballos', label: 'Caballos', icon: 'fa-solid fa-horse', roles: ['ROLE_ADMIN', 'ROLE_VETERINARIO', 'ROLE_CUIDADOR', 'ROLE_CLIENTE', 'ROLE_POTRADOR'] },
    { path: '/personal', label: 'Personal & Turnos', icon: 'fa-solid fa-users-gear', roles: ['ROLE_ADMIN'] },
    { path: '/calendario', label: 'Calendario & Reservas', icon: 'fa-regular fa-calendar-days', roles: ['ROLE_ADMIN', 'ROLE_VETERINARIO', 'ROLE_CUIDADOR', 'ROLE_CLIENTE', 'ROLE_POTRADOR'] },
    { path: '/alimentacion', label: 'Alimentación', icon: 'fa-solid fa-wheat-awn', roles: ['ROLE_ADMIN', 'ROLE_VETERINARIO', 'ROLE_CUIDADOR'] },
    { path: '/inventario', label: 'Inventario de Insumos', icon: 'fa-solid fa-boxes-stacked', roles: ['ROLE_ADMIN', 'ROLE_VETERINARIO'] },
  ];

  const visibleItems = menuItems.filter(item => hasRole(item.roles));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 998,
            display: 'none'
          }}
          className="sidebar-overlay-mobile"
        />
      )}

      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        transition: 'var(--transition-normal)'
      }} className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        
        {/* Sidebar Header */}
        <div style={{
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-sidebar-active)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-md)',
            border: '2px solid var(--accent-gold)'
          }}>
            <i className="fa-solid fa-horse-head fa-2xl" style={{ color: 'var(--accent-gold)' }}></i>
          </div>
          <span style={{
            fontFamily: 'Playfair Display',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '0.05em'
          }}>
            SGC Hípico
          </span>
          <span style={{
            fontSize: '0.75rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginTop: '0.2rem'
          }}>
            Estancia San Rafael
          </span>
        </div>

        {/* Sidebar Links */}
        <nav style={{
          flex: 1,
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          overflowY: 'auto'
        }}>
          {visibleItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.4)',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <span>v1.0.0 - Examen final</span>
        </div>

        <style>{`
          .sidebar-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.85rem 1.25rem;
            color: rgba(255, 255, 255, 0.8);
            border-radius: var(--radius-md);
            font-weight: 500;
            font-size: 0.95rem;
            transition: var(--transition-normal);
            border-left: 3px solid transparent;
          }
          .sidebar-link i {
            width: 20px;
            font-size: 1.1rem;
            text-align: center;
          }
          .sidebar-link:hover {
            color: white;
            background-color: rgba(255, 255, 255, 0.05);
            transform: translateX(4px);
          }
          .sidebar-link.active {
            color: white;
            background-color: var(--bg-sidebar-active);
            border-left-color: var(--accent-gold);
            font-weight: 600;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          @media (max-width: 768px) {
            .sidebar-container {
              position: fixed;
              left: -260px;
              top: 0;
              bottom: 0;
              height: 100vh;
              z-index: 1001;
            }
            .sidebar-container.open {
              left: 0;
              box-shadow: 5px 0 15px rgba(0,0,0,0.5);
            }
            .sidebar-overlay-mobile {
              display: block !important;
            }
          }
        `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
