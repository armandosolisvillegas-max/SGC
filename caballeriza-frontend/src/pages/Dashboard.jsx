import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { caballoApi } from '../api/caballoApi';
import { empleadoApi, reservaApi, inventarioApi, alertaApi } from '../api/apiModules';
import Button from '../components/ui/Button';

export const Dashboard = () => {
  const { user, isRole } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    horses: 0,
    employees: 0,
    bookings: 0,
    lowStock: 0
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const horses = await caballoApi.getAll();
      const employees = await empleadoApi.getAll();
      const bookings = await reservaApi.getAll();
      const lowStockItems = await inventarioApi.getLowStock();
      const activeAlerts = await alertaApi.getAll({ leida: 'false' });

      setStats({
        horses: horses.length,
        employees: employees.length,
        bookings: bookings.filter(b => b.estado !== 'CANCELADA').length,
        lowStock: lowStockItems.length
      });
      setAlerts(activeAlerts.slice(0, 5)); // show top 5 unread alerts
    } catch (e) {
      console.error("Error al cargar datos del dashboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDismissAlert = async (id) => {
    try {
      await alertaApi.markAsRead(id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      // update low stock stat
      const lowStockItems = await inventarioApi.getLowStock();
      setStats(prev => ({ ...prev, lowStock: lowStockItems.length }));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--accent-gold)' }}></i>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome banner */}
      <div style={{
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, var(--bg-sidebar) 0%, rgba(11,102,77,0.3) 100%)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>¡Hola, {user?.nombre}!</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem' }}>
            Bienvenido al panel del Sistema de Gestión de Caballeriza. Tu rol asignado es: <strong>{user?.rol}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isRole.isCliente() && (
            <Button onClick={() => navigate('/calendario')} icon="fa-solid fa-calendar-plus">
              Nueva Reserva
            </Button>
          )}
          {isRole.isVeterinario() && (
            <Button onClick={() => navigate('/caballos')} icon="fa-solid fa-notes-medical">
              Historiales Médicos
            </Button>
          )}
          {(isRole.isAdmin() || isRole.isCuidador()) && (
            <Button onClick={() => navigate('/alimentacion')} icon="fa-solid fa-wheat-awn">
              Registrar Alimentación
            </Button>
          )}
        </div>
      </div>

      {/* Grid statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Horses Stat */}
        <div className="card" onClick={() => navigate('/caballos')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Caballos</span>
              <h2 style={{ fontSize: '2.5rem', margin: '0.25rem 0 0 0' }}>{stats.horses}</h2>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fa-solid fa-horse fa-xl" style={{ color: 'var(--accent-gold)' }}></i>
            </div>
          </div>
        </div>

        {/* Reservations Stat */}
        <div className="card" onClick={() => navigate('/calendario')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Reservas Activas</span>
              <h2 style={{ fontSize: '2.5rem', margin: '0.25rem 0 0 0' }}>{stats.bookings}</h2>
            </div>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              backgroundColor: 'rgba(14, 165, 233, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fa-regular fa-calendar-check fa-xl" style={{ color: 'var(--color-info)' }}></i>
            </div>
          </div>
        </div>

        {/* Employees Stat (Only for non-clients) */}
        {!isRole.isCliente() && (
          <div className="card" onClick={() => navigate(isRole.isAdmin() ? '/personal' : '/dashboard')} style={{ cursor: isRole.isAdmin() ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Personal</span>
                <h2 style={{ fontSize: '2.5rem', margin: '0.25rem 0 0 0' }}>{stats.employees}</h2>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fa-solid fa-users fa-xl" style={{ color: 'var(--color-success)' }}></i>
              </div>
            </div>
          </div>
        )}

        {/* Low Stock Stat */}
        {!isRole.isCliente() && (
          <div className="card" onClick={() => navigate('/inventario')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Stock Alerta</span>
                <h2 style={{ fontSize: '2.5rem', margin: '0.25rem 0 0 0', color: stats.lowStock > 0 ? 'var(--color-warning)' : 'inherit' }}>{stats.lowStock}</h2>
              </div>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                backgroundColor: stats.lowStock > 0 ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className="fa-solid fa-triangle-exclamation fa-xl" style={{ color: stats.lowStock > 0 ? 'var(--color-warning)' : 'var(--text-secondary)' }}></i>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main dashboard body sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: alerts.length > 0 ? '2fr 1fr' : '1fr',
        gap: '2.5rem',
        alignItems: 'start'
      }}>
        {/* Left Side: Stables Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3>Acerca de la Estancia</h3>
              <i className="fa-solid fa-compass" style={{ color: 'var(--accent-gold)' }}></i>
            </div>
            <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
              Estancia San Rafael es una caballeriza de alto rendimiento equipada con áreas de entrenamiento para salto, pistas de paseo recreativo y un laboratorio veterinario. Este panel unificado te permite supervisar el bienestar de los animales, el inventario de medicamentos y alimentos, y las agendas de los clientes en tiempo real.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <i className="fa-solid fa-medal text-gold fa-lg" style={{ marginBottom: '0.5rem', display: 'block' }}></i>
                <strong>Salud Garantizada</strong>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Control médico diario</p>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <i className="fa-solid fa-seedling text-success fa-lg" style={{ marginBottom: '0.5rem', display: 'block' }}></i>
                <strong>Nutrición Orgánica</strong>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Heno y suplementos premium</p>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <i className="fa-solid fa-shield-halved text-info fa-lg" style={{ marginBottom: '0.5rem', display: 'block' }}></i>
                <strong>Seguridad Equina</strong>
                <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Pesebreras climatizadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Active alerts / pending actions */}
        {alerts.length > 0 && (
          <div className="card" style={{ borderColor: 'rgba(249, 115, 22, 0.2)' }}>
            <div className="card-header" style={{ borderBottomColor: 'rgba(249, 115, 22, 0.1)' }}>
              <h3 style={{ color: 'var(--color-warning)' }}>
                <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.5rem' }}></i>
                Alertas Críticas
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.map(a => (
                <div key={a.id} style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(249, 115, 22, 0.05)',
                  border: '1px solid rgba(249, 115, 22, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  position: 'relative'
                }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '0.5rem', paddingRight: '1.5rem' }}>
                    {a.mensaje}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Fecha: {a.fecha}
                  </span>
                  <button
                    onClick={() => handleDismissAlert(a.id)}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                    title="Descartar alerta"
                  >
                    <i className="fa-solid fa-xmark hover:text-success"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .text-gold { color: var(--accent-gold); }
        .text-success { color: var(--color-success); }
        .text-info { color: var(--color-info); }
        .text-error { color: var(--color-error); }
      `}</style>
    </div>
  );
};

export default Dashboard;
