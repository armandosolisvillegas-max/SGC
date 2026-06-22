import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

export const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('ROLE_CLIENTE');

  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    if (isRegistering && !nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio.';
    }
    if (!email.trim()) {
      errors.email = 'El correo es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'El correo no tiene un formato válido.';
    }
    if (!password) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (password.length < 5) {
      errors.password = 'Mínimo 5 caracteres.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isRegistering) {
        await register(nombre, email, password, rol);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg-primary)',
      background: 'radial-gradient(circle at 50% 50%, #131c2e 0%, #0b0f19 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative stable vector backgrounds */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50%',
        height: '50%',
        backgroundColor: 'rgba(6, 60, 44, 0.05)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50%',
        height: '50%',
        backgroundColor: 'rgba(245, 158, 11, 0.03)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      <div className="slide-up" style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '2px solid var(--accent-gold)',
            marginBottom: '1rem'
          }}>
            <i className="fa-solid fa-horse-head fa-2xl" style={{ color: 'var(--accent-gold)' }}></i>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display', marginBottom: '0.25rem' }}>
            {isRegistering ? 'Crear Cuenta SGC' : 'Ingresar a Caballeriza'}
          </h1>
          <p style={{ fontSize: '0.85rem' }}>
            {isRegistering ? 'Regístrate para gestionar caballerizas' : 'Ingresa tus credenciales para acceder'}
          </p>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--color-error)',
            color: 'var(--text-primary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--color-error)' }}></i>
            <span>{apiError}</span>
          </div>
        )}

        {/* Login/Register Form */}
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              {formErrors.nombre && <div className="form-feedback">{formErrors.nombre}</div>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="text"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {formErrors.email && <div className="form-feedback">{formErrors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && <div className="form-feedback">{formErrors.password}</div>}
          </div>

          {isRegistering && (
            <div className="form-group">
              <label className="form-label">Rol del Usuario</label>
              <select
                className="form-control"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
              >
                <option value="ROLE_CLIENTE">Cliente (Propietario / Jinete)</option>
                <option value="ROLE_CUIDADOR">Cuidador de Establo</option>
                <option value="ROLE_VETERINARIO">Veterinario Asignado</option>
                <option value="ROLE_ADMIN">Administrador General</option>
              </select>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
          >
            {submitting ? (
              <i className="fa-solid fa-circle-notch fa-spin"></i>
            ) : isRegistering ? (
              'Registrarse'
            ) : (
              'Iniciar Sesión'
            )}
          </Button>
        </form>

        {/* Toggle Option */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setFormErrors({});
              setApiError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Registrate aquí'}
          </button>
        </div>

        {/* Admin accounts quick-login tip */}
        {!isRegistering && (
          <div style={{
            marginTop: '2rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <strong style={{ color: 'var(--accent-gold)' }}>Acceso rápido (Mock DB):</strong>
            <ul style={{ listStyleType: 'none', marginTop: '0.25rem', paddingLeft: 0 }}>
              <li>Admin: <code>admin@caballo.com</code> / <code>admin123</code></li>
              <li>Vet: <code>vet@caballo.com</code> / <code>vet123</code></li>
              <li>Cuidador: <code>cuidador@caballo.com</code> / <code>cuidador123</code></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
