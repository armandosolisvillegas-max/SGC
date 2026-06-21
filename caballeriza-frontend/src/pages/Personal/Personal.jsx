import React, { useState, useEffect } from 'react';
import { empleadoApi } from '../../api/apiModules';
import usePagination from '../../hooks/usePagination';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export const Personal = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Employee Form CRUD
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [empForm, setEmpForm] = useState({ nombre: '', rol: 'cuidador', contacto: '' });
  const [empErrors, setEmpErrors] = useState({});

  // Shifts Form
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [shiftForm, setShiftForm] = useState({ fecha: '', horaInicio: '08:00', horaFin: '17:00', tareaAsignada: '' });
  const [shiftErrors, setShiftErrors] = useState({});

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await empleadoApi.getAll();
      setEmployees(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(e => 
    e.nombre.toLowerCase().includes(search.toLowerCase()) || 
    e.rol.toLowerCase().includes(search.toLowerCase())
  );

  const pagination = usePagination(filteredEmployees, 5);

  // Validate Employee
  const validateEmployee = () => {
    const err = {};
    if (!empForm.nombre.trim()) err.nombre = 'El nombre es obligatorio.';
    if (!empForm.contacto.trim()) err.contacto = 'El contacto es obligatorio.';
    setEmpErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    if (!validateEmployee()) return;

    try {
      if (editingEmp) {
        await empleadoApi.update(editingEmp.id, empForm);
      } else {
        await empleadoApi.create(empForm);
      }
      setIsEmpModalOpen(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("¿Seguro que desea remover este empleado? Se eliminarán también sus turnos de trabajo registrados.")) {
      try {
        await empleadoApi.delete(id);
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAddEmpModal = () => {
    setEditingEmp(null);
    setEmpForm({ nombre: '', rol: 'cuidador', contacto: '' });
    setEmpErrors({});
    setIsEmpModalOpen(true);
  };

  const openEditEmpModal = (emp) => {
    setEditingEmp(emp);
    setEmpForm({ nombre: emp.nombre, rol: emp.rol, contacto: emp.contacto });
    setEmpErrors({});
    setIsEmpModalOpen(true);
  };

  // Open shifts manager
  const openShiftModal = async (emp) => {
    setSelectedEmp(emp);
    setShiftErrors({});
    setShiftForm({ fecha: new Date().toISOString().split('T')[0], horaInicio: '08:00', horaFin: '17:00', tareaAsignada: '' });
    try {
      const data = await empleadoApi.getShifts(emp.id);
      setShifts(data);
      setIsShiftModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const validateShift = () => {
    const err = {};
    if (!shiftForm.fecha) err.fecha = 'La fecha es obligatoria.';
    if (!shiftForm.horaInicio) err.horaInicio = 'Hora inicio requerida.';
    if (!shiftForm.horaFin) err.horaFin = 'Hora fin requerida.';
    if (shiftForm.horaInicio >= shiftForm.horaFin) err.horaFin = 'La hora de fin debe ser posterior a la de inicio.';
    if (!shiftForm.tareaAsignada.trim()) err.tareaAsignada = 'La descripción de la tarea es obligatoria.';
    setShiftErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddShift = async (e) => {
    e.preventDefault();
    if (!validateShift()) return;

    try {
      const newShift = await empleadoApi.addShift(selectedEmp.id, shiftForm);
      setShifts(prev => [...prev, newShift]);
      setShiftForm({ fecha: new Date().toISOString().split('T')[0], horaInicio: '08:00', horaFin: '17:00', tareaAsignada: '' });
      setShiftErrors({});
    } catch (err) {
      console.error(err);
    }
  };

  const renderEmpRow = (emp) => (
    <tr key={emp.id}>
      <td>{emp.nombre}</td>
      <td>
        <span className={`badge ${getRolBadgeClass(emp.rol)}`}>
          {emp.rol}
        </span>
      </td>
      <td>{emp.contacto}</td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => openShiftModal(emp)} style={{ padding: '0.4rem 0.6rem' }} title="Programar Turnos" icon="fa-solid fa-calendar-plus">
            Turnos
          </Button>
          <Button variant="secondary" onClick={() => openEditEmpModal(emp)} style={{ padding: '0.4rem 0.6rem' }}>
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          <Button variant="danger" onClick={() => handleDeleteEmployee(emp.id)} style={{ padding: '0.4rem 0.6rem' }}>
            <i className="fa-solid fa-trash-can"></i>
          </Button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
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
          <h1>Personal de Caballeriza</h1>
          <p>Administra los expedientes del staff y sus horarios de turnos/tareas asignadas.</p>
        </div>
        <Button onClick={openAddEmpModal} icon="fa-solid fa-user-plus">
          Registrar Empleado
        </Button>
      </div>

      {/* Filter card */}
      <div className="card" style={{ padding: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <i className="fa-solid fa-magnifying-glass" style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
          }}></i>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar empleado por nombre o especialidad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Table listing */}
      <Table
        headers={['Nombre Completo', 'Rol / Función', 'Datos de Contacto', 'Acciones']}
        data={pagination.paginatedItems}
        renderRow={renderEmpRow}
        pagination={pagination}
      />

      {/* Employee Add/Edit Modal */}
      <Modal isOpen={isEmpModalOpen} onClose={() => setIsEmpModalOpen(false)} title={editingEmp ? "Editar Datos del Empleado" : "Registrar Empleado"}>
        <form onSubmit={handleSaveEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre del Empleado</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej. Pedro Alvares"
              value={empForm.nombre}
              onChange={(e) => setEmpForm(prev => ({ ...prev, nombre: e.target.value }))}
            />
            {empErrors.nombre && <div className="form-feedback">{empErrors.nombre}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Rol del Empleado</label>
            <select
              className="form-control"
              value={empForm.rol}
              onChange={(e) => setEmpForm(prev => ({ ...prev, rol: e.target.value }))}
              style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
            >
              <option value="veterinario">Veterinario</option>
              <option value="potrador">Potrador (Entrenador)</option>
              <option value="cuidador">Cuidador de Establos</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Información de Contacto (Teléfono / Email)</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej. +506 8877-6655"
              value={empForm.contacto}
              onChange={(e) => setEmpForm(prev => ({ ...prev, contacto: e.target.value }))}
            />
            {empErrors.contacto && <div className="form-feedback">{empErrors.contacto}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsEmpModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar Empleado</Button>
          </div>
        </form>
      </Modal>

      {/* Shifts Scheduler Modal */}
      <Modal isOpen={isShiftModalOpen} onClose={() => setIsShiftModalOpen(false)} title={selectedEmp ? `Calendario de Trabajo: ${selectedEmp.nombre}` : "Horarios"}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Add Shift form */}
          <div className="card" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Programar Turno y Tarea
            </h4>
            <form onSubmit={handleAddShift} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    value={shiftForm.fecha}
                    onChange={(e) => setShiftForm(prev => ({ ...prev, fecha: e.target.value }))}
                  />
                  {shiftErrors.fecha && <div className="form-feedback">{shiftErrors.fecha}</div>}
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hora Inicio</label>
                  <input
                    type="time"
                    className="form-control"
                    value={shiftForm.horaInicio}
                    onChange={(e) => setShiftForm(prev => ({ ...prev, horaInicio: e.target.value }))}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Hora Fin</label>
                  <input
                    type="time"
                    className="form-control"
                    value={shiftForm.horaFin}
                    onChange={(e) => setShiftForm(prev => ({ ...prev, horaFin: e.target.value }))}
                  />
                  {shiftErrors.horaFin && <div className="form-feedback">{shiftErrors.horaFin}</div>}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Tarea Asignada</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Alimentar potros, cepillado de Rayo, chequeo de vacunas..."
                  value={shiftForm.tareaAsignada}
                  onChange={(e) => setShiftForm(prev => ({ ...prev, tareaAsignada: e.target.value }))}
                />
                {shiftErrors.tareaAsignada && <div className="form-feedback">{shiftErrors.tareaAsignada}</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button type="submit" variant="success" icon="fa-solid fa-clock">
                  Asignar Turno
                </Button>
              </div>
            </form>
          </div>

          {/* Shift list */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Turnos Programados</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
              {shifts.length > 0 ? (
                shifts.map(shift => (
                  <div key={shift.id} style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
                      <span><i className="fa-regular fa-calendar" style={{ marginRight: '0.4rem' }}></i>{shift.fecha}</span>
                      <span><i className="fa-regular fa-clock" style={{ marginRight: '0.4rem' }}></i>{shift.horaInicio} - {shift.horaFin}</span>
                    </div>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      <strong>Tarea:</strong> {shift.tareaAsignada}
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem' }}>
                  No tiene turnos asignados para esta semana.
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsShiftModalOpen(false)}>Cerrar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );

  function getRolBadgeClass(rol) {
    switch (rol) {
      case 'veterinario': return 'badge-info';
      case 'potrador': return 'badge-warning';
      case 'cuidador': return 'badge-success';
      default: return 'badge-primary';
    }
  }
};

export default Personal;
