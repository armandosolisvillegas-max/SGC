import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { reservaApi } from '../../api/apiModules';
import { caballoApi } from '../../api/caballoApi';
import usePagination from '../../hooks/usePagination';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export const Calendario = () => {
  const { user, isRole } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [horses, setHorses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterTipo, setFilterTipo] = useState('');
  const [filterFecha, setFilterFecha] = useState('');

  // Booking Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    tipo: 'paseo', fecha: '', horaInicio: '08:00', horaFin: '09:30', caballoId: '', cupoMaximo: '5'
  });
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterTipo) params.tipo = filterTipo;
      if (filterFecha) params.fecha = filterFecha;
      
      const [bookingsData, horsesData] = await Promise.all([
        reservaApi.getAll(params),
        caballoApi.getAll()
      ]);

      setBookings(bookingsData);
      setHorses(horsesData);
      
      // Auto select first horse in form
      if (horsesData.length > 0 && !bookingForm.caballoId) {
        setBookingForm(prev => ({ ...prev, caballoId: horsesData[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterTipo, filterFecha]);

  const pagination = usePagination(bookings, 8);

  const validate = () => {
    const err = {};
    if (!bookingForm.fecha) err.fecha = 'La fecha es obligatoria.';
    if (!bookingForm.horaInicio) err.horaInicio = 'La hora de inicio es obligatoria.';
    if (!bookingForm.horaFin) err.horaFin = 'La hora de fin es obligatoria.';
    if (bookingForm.horaInicio >= bookingForm.horaFin) err.horaFin = 'La hora de fin debe ser posterior a la de inicio.';
    if (!bookingForm.caballoId) err.caballoId = 'Debe seleccionar un caballo.';
    
    const cupoNum = Number(bookingForm.cupoMaximo);
    if (!bookingForm.cupoMaximo) err.cupoMaximo = 'El cupo máximo es obligatorio.';
    else if (isNaN(cupoNum) || cupoNum <= 0) err.cupoMaximo = 'Debe ser un número mayor a 0.';

    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    try {
      await reservaApi.create({
        ...bookingForm,
        clienteId: user.id
      });
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      if (err.message && err.message.includes("EXCESO_CUPO")) {
        setApiError("Capacidad Agotada: El caballo seleccionado ya tiene una reserva en esta fecha y hora o supera el cupo máximo.");
      } else {
        setApiError(err.message || "Error al registrar la reserva.");
      }
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("¿Está seguro que desea cancelar esta reserva?")) {
      try {
        await reservaApi.cancel(id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar permanentemente esta reserva del historial?")) {
      try {
        await reservaApi.delete(id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAddModal = () => {
    setBookingForm({
      tipo: 'paseo',
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: '08:00',
      horaFin: '09:30',
      caballoId: horses.length > 0 ? horses[0].id : '',
      cupoMaximo: '5'
    });
    setFormErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  const renderBookingRow = (booking) => (
    <tr key={booking.id} style={{ opacity: booking.estado === 'CANCELADA' ? 0.6 : 1 }}>
      <td>
        <span className={`badge ${getTipoBadgeClass(booking.tipo)}`}>
          {booking.tipo.replace('_', ' ')}
        </span>
      </td>
      <td>
        <div style={{ fontWeight: 500 }}>{booking.fecha}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {booking.horaInicio} - {booking.horaFin}
        </div>
      </td>
      <td>{booking.caballoNombre}</td>
      <td>{booking.clienteNombre}</td>
      <td>
        {booking.tipo === 'paseo' || booking.tipo === 'monta' ? (
          <span>{booking.cupoActual || 1} / {booking.cupoMaximo}</span>
        ) : (
          <span style={{ color: 'var(--text-secondary)' }}>Individual</span>
        )}
      </td>
      <td>
        <span className={`badge ${getEstadoBadgeClass(booking.estado)}`}>
          {booking.estado}
        </span>
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {booking.estado !== 'CANCELADA' && (
            <Button
              variant="secondary"
              onClick={() => handleCancelBooking(booking.id)}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
              title="Cancelar Reserva"
            >
              Cancelar
            </Button>
          )}
          {isRole.isAdmin() && (
            <Button
              variant="danger"
              onClick={() => handleDeleteBooking(booking.id)}
              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
              title="Eliminar Reserva"
            >
              <i className="fa-solid fa-trash-can"></i>
            </Button>
          )}
        </div>
      </td>
    </tr>
  );

  if (loading && bookings.length === 0) {
    return (
      <div style={{ display: 'flex', justifySelf: 'center', alignSelf: 'center', padding: '5rem' }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--accent-gold)' }}></i>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Calendario y Reservas</h1>
          <p>Controla la agenda de paseos guiados, citas veterinarias y entrenamientos.</p>
        </div>
        <Button onClick={openAddModal} icon="fa-regular fa-calendar-plus">
          Crear Reserva
        </Button>
      </div>

      {/* Filters and search card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">Filtrar por tipo</label>
            <select
              className="form-control"
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
            >
              <option value="">Todos los eventos</option>
              <option value="cita_vet">Cita Veterinaria</option>
              <option value="monta">Monta</option>
              <option value="paseo">Paseo Recreativo</option>
              <option value="entrenamiento">Entrenamiento</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <label className="form-label">Filtrar por fecha</label>
            <input
              type="date"
              className="form-control"
              value={filterFecha}
              onChange={(e) => setFilterFecha(e.target.value)}
            />
          </div>
          {(filterTipo || filterFecha) && (
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setFilterTipo('');
                  setFilterFecha('');
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <Table
        headers={['Tipo de Evento', 'Fecha y Horario', 'Caballo', 'Cliente', 'Cupos', 'Estado', 'Acciones']}
        data={pagination.paginatedItems}
        renderRow={renderBookingRow}
        pagination={pagination}
      />

      {/* Create Booking Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nueva Reserva">
        {apiError && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--color-error)',
            color: 'var(--text-primary)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--color-error)' }}></i>
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de Actividad</label>
              <select
                className="form-control"
                value={bookingForm.tipo}
                onChange={(e) => setBookingForm(prev => ({ ...prev, tipo: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
              >
                <option value="cita_vet">Cita Veterinaria</option>
                <option value="monta">Monta</option>
                <option value="paseo">Paseo Recreativo</option>
                <option value="entrenamiento">Entrenamiento</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Caballo Asignado</label>
              <select
                className="form-control"
                value={bookingForm.caballoId}
                onChange={(e) => setBookingForm(prev => ({ ...prev, caballoId: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
              >
                {horses.map(h => (
                  <option key={h.id} value={h.id}>{h.nombre} ({h.identificador})</option>
                ))}
              </select>
              {formErrors.caballoId && <div className="form-feedback">{formErrors.caballoId}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="form-control"
                value={bookingForm.fecha}
                onChange={(e) => setBookingForm(prev => ({ ...prev, fecha: e.target.value }))}
              />
              {formErrors.fecha && <div className="form-feedback">{formErrors.fecha}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Cupo Máximo</label>
              <input
                type="number"
                className="form-control"
                value={bookingForm.cupoMaximo}
                disabled={bookingForm.tipo === 'cita_vet' || bookingForm.tipo === 'entrenamiento'}
                onChange={(e) => setBookingForm(prev => ({ ...prev, cupoMaximo: e.target.value }))}
              />
              {formErrors.cupoMaximo && <div className="form-feedback">{formErrors.cupoMaximo}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Hora Inicio</label>
              <input
                type="time"
                className="form-control"
                value={bookingForm.horaInicio}
                onChange={(e) => setBookingForm(prev => ({ ...prev, horaInicio: e.target.value }))}
              />
              {formErrors.horaInicio && <div className="form-feedback">{formErrors.horaInicio}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Hora Fin</label>
              <input
                type="time"
                className="form-control"
                value={bookingForm.horaFin}
                onChange={(e) => setBookingForm(prev => ({ ...prev, horaFin: e.target.value }))}
              />
              {formErrors.horaFin && <div className="form-feedback">{formErrors.horaFin}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar Reserva</Button>
          </div>
        </form>
      </Modal>
    </div>
  );

  function getTipoBadgeClass(tipo) {
    switch (tipo) {
      case 'cita_vet': return 'badge-error';
      case 'monta': return 'badge-success';
      case 'paseo': return 'badge-info';
      default: return 'badge-warning';
    }
  }

  function getEstadoBadgeClass(estado) {
    switch (estado) {
      case 'CONFIRMADA': return 'badge-success';
      case 'PENDIENTE': return 'badge-warning';
      default: return 'badge-error';
    }
  }
};

export default Calendario;
