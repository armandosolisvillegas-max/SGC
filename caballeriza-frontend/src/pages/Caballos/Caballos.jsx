import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { caballoApi } from '../../api/caballoApi';
import usePagination from '../../hooks/usePagination';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export const Caballos = () => {
  const { isRole } = useAuth();
  const navigate = useNavigate();
  const [horses, setHorses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states for Horse CRUD
  const [isHorseModalOpen, setIsHorseModalOpen] = useState(false);
  const [editingHorse, setEditingHorse] = useState(null);
  const [horseForm, setHorseForm] = useState({
    nombre: '', identificador: '', edad: '', raza: '', sexo: 'Macho', peso: '', fotoUrl: ''
  });
  const [horseErrors, setHorseErrors] = useState({});
  const [horseSaveError, setHorseSaveError] = useState('');

  // Medical History states
  const [isMedicalModalOpen, setIsMedicalModalOpen] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [medicalForm, setMedicalForm] = useState({
    tipo: 'vacuna', descripcion: '', responsableNombre: ''
  });
  const [medicalErrors, setMedicalErrors] = useState({});

  const fetchHorses = async () => {
    try {
      setLoading(true);
      const data = await caballoApi.getAll();
      setHorses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHorses();
  }, []);

  // Filter horses
  const filteredHorses = horses.filter(h => 
    h.nombre.toLowerCase().includes(search.toLowerCase()) || 
    h.raza.toLowerCase().includes(search.toLowerCase()) || 
    h.identificador.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination hook
  const pagination = usePagination(filteredHorses, 6);

  // Base64 file reader with compression to avoid DB truncation
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const MAX_SIZE = 800;
      let { width, height } = img;
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) { height = Math.round(height * MAX_SIZE / width); width = MAX_SIZE; }
        else { width = Math.round(width * MAX_SIZE / height); height = MAX_SIZE; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', 0.75);
      URL.revokeObjectURL(objectUrl);
      setHorseForm(prev => ({ ...prev, fotoUrl: compressed }));
    };
    img.src = objectUrl;
  };

  // Validate Horse Form
  const validateHorse = () => {
    const err = {};
    if (!horseForm.nombre.trim()) err.nombre = 'El nombre es obligatorio.';
    if (!horseForm.identificador.trim()) err.identificador = 'El identificador es obligatorio.';
    
    const edadNum = Number(horseForm.edad);
    if (!horseForm.edad) err.edad = 'La edad es obligatoria.';
    else if (isNaN(edadNum) || edadNum <= 0) err.edad = 'Debe ser un número positivo.';
    
    const pesoNum = Number(horseForm.peso);
    if (!horseForm.peso) err.peso = 'El peso es obligatorio.';
    else if (isNaN(pesoNum) || pesoNum <= 0) err.peso = 'Debe ser un número positivo.';

    setHorseErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveHorse = async (e) => {
    e.preventDefault();
    setHorseSaveError('');
    if (!validateHorse()) return;

    try {
      if (editingHorse) {
        await caballoApi.update(editingHorse.id, horseForm);
      } else {
        // default beautiful horse background if no file uploaded
        const finalForm = {
          ...horseForm,
          fotoUrl: horseForm.fotoUrl || "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500&auto=format&fit=crop"
        };
        await caballoApi.create(finalForm);
      }
      setIsHorseModalOpen(false);
      fetchHorses();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Error al guardar el caballo. Intente de nuevo.';
      setHorseSaveError(msg);
    }
  };

  const handleDeleteHorse = async (id) => {
    if (window.confirm("¿Seguro que desea eliminar este caballo? Se borrarán sus historiales y planes de alimentación asociados.")) {
      try {
        await caballoApi.delete(id);
        fetchHorses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAddHorseModal = () => {
    setEditingHorse(null);
    setHorseForm({ nombre: '', identificador: '', edad: '', raza: '', sexo: 'Macho', peso: '', fotoUrl: '' });
    setHorseErrors({});
    setIsHorseModalOpen(true);
  };

  const openEditHorseModal = (horse) => {
    setEditingHorse(horse);
    setHorseForm({
      nombre: horse.nombre,
      identificador: horse.identificador,
      edad: horse.edad,
      raza: horse.raza,
      sexo: horse.sexo,
      peso: horse.peso,
      fotoUrl: horse.fotoUrl
    });
    setHorseErrors({});
    setIsHorseModalOpen(true);
  };

  // Open medical reports view
  const openMedicalModal = async (horse) => {
    setSelectedHorse(horse);
    setMedicalErrors({});
    setMedicalForm({ tipo: 'vacuna', descripcion: '', responsableNombre: '' });
    try {
      const history = await caballoApi.getMedicalHistory(horse.id);
      setMedicalHistory(history);
      setIsMedicalModalOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  const validateMedical = () => {
    const err = {};
    if (!medicalForm.descripcion.trim()) err.descripcion = 'La descripción es obligatoria.';
    if (!medicalForm.responsableNombre.trim()) err.responsableNombre = 'El nombre del responsable es obligatorio.';
    setMedicalErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddMedicalEntry = async (e) => {
    e.preventDefault();
    if (!validateMedical()) return;

    try {
      const newEntry = await caballoApi.addMedicalEntry(selectedHorse.id, {
        tipo: medicalForm.tipo,
        descripcion: medicalForm.descripcion,
        responsableId: 99, // dummy id
        responsableNombre: medicalForm.responsableNombre,
        fecha: new Date().toISOString().split('T')[0]
      });
      setMedicalHistory(prev => [...prev, newEntry]);
      setMedicalForm({ tipo: 'vacuna', descripcion: '', responsableNombre: '' });
      setMedicalErrors({});
    } catch (err) {
      console.error(err);
    }
  };

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/dashboard')}
            title="Volver al Inicio"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition-normal)',
              flexShrink: 0
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(245,158,11,0.15)'; e.currentTarget.style.color = 'var(--accent-gold)'; e.currentTarget.style.borderColor = 'var(--accent-gold)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
          >
            <i className="fa-solid fa-house" style={{ fontSize: '0.9rem' }}></i>
          </button>
          <div>
            <h1>Gestión de Caballos</h1>
            <p>Supervisa el registro, ficha técnica e historial de salud de todos los equinos.</p>
          </div>
        </div>
        {!isRole.isCliente() && (
          <Button onClick={openAddHorseModal} icon="fa-solid fa-plus">
            Registrar Caballo
          </Button>
        )}
      </div>

      {/* Filter and search */}
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
            placeholder="Buscar por nombre, raza o identificador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Horse cards layout */}
      <div className="grid-cards">
        {pagination.paginatedItems.map(horse => (
          <div key={horse.id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
            {/* Horse Image */}
            <div style={{
              height: '180px',
              width: '100%',
              backgroundImage: `url(${horse.fotoUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}>
              <span className="badge badge-info" style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(11,15,25,0.7)',
                backdropFilter: 'blur(4px)'
              }}>
                {horse.identificador}
              </span>
            </div>

            {/* Horse Details */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ margin: 0 }}>{horse.nombre}</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <div><strong>Raza:</strong> {horse.raza}</div>
                <div><strong>Género:</strong> {horse.sexo}</div>
                <div><strong>Edad:</strong> {horse.edad} {horse.edad === 1 ? 'año' : 'años'}</div>
                <div><strong>Peso:</strong> {horse.peso} kg</div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <Button 
                  variant="secondary" 
                  onClick={() => openMedicalModal(horse)} 
                  style={{ flex: 1, padding: '0.4rem' }}
                  icon="fa-solid fa-notes-medical"
                >
                  Salud
                </Button>
                
                {!isRole.isCliente() && (
                  <Button 
                    variant="secondary" 
                    onClick={() => openEditHorseModal(horse)} 
                    style={{ padding: '0.4rem 0.6rem' }}
                    title="Editar datos"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                )}

                {isRole.isAdmin() && (
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteHorse(horse.id)} 
                    style={{ padding: '0.4rem 0.6rem' }}
                    title="Eliminar registro"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      {pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Mostrando {pagination.paginatedItems.length} de {pagination.totalItems} caballos
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={pagination.prevPage} disabled={pagination.currentPage === 1}>
              <i className="fa-solid fa-chevron-left"></i>
            </Button>
            <Button variant="secondary" onClick={pagination.nextPage} disabled={pagination.currentPage === pagination.totalPages}>
              <i className="fa-solid fa-chevron-right"></i>
            </Button>
          </div>
        </div>
      )}

      {/* Horse Add/Edit Modal */}
      <Modal 
        isOpen={isHorseModalOpen} 
        onClose={() => setIsHorseModalOpen(false)} 
        title={editingHorse ? "Editar Caballo" : "Registrar Nuevo Caballo"}
      >
        <form onSubmit={handleSaveHorse} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nombre del Caballo</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Rayo"
                value={horseForm.nombre}
                onChange={(e) => setHorseForm(prev => ({ ...prev, nombre: e.target.value }))}
              />
              {horseErrors.nombre && <div className="form-feedback">{horseErrors.nombre}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Identificador único</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. CAB-104"
                value={horseForm.identificador}
                onChange={(e) => setHorseForm(prev => ({ ...prev, identificador: e.target.value }))}
              />
              {horseErrors.identificador && <div className="form-feedback">{horseErrors.identificador}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Edad (años)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ej. 6"
                value={horseForm.edad}
                onChange={(e) => setHorseForm(prev => ({ ...prev, edad: e.target.value }))}
              />
              {horseErrors.edad && <div className="form-feedback">{horseErrors.edad}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Raza</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej. Frisón"
                value={horseForm.raza}
                onChange={(e) => setHorseForm(prev => ({ ...prev, raza: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sexo</label>
              <select
                className="form-control"
                value={horseForm.sexo}
                onChange={(e) => setHorseForm(prev => ({ ...prev, sexo: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
              >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Peso (kg)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ej. 480"
                value={horseForm.peso}
                onChange={(e) => setHorseForm(prev => ({ ...prev, peso: e.target.value }))}
              />
              {horseErrors.peso && <div className="form-feedback">{horseErrors.peso}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Fotografía del Caballo</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handlePhotoUpload}
              style={{ padding: '0.4rem' }}
            />
            {horseForm.fotoUrl && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <img 
                  src={horseForm.fotoUrl} 
                  alt="Vista previa" 
                  style={{ maxHeight: '120px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} 
                />
              </div>
            )}
          </div>

          {horseSaveError && (
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.15)',
              border: '1px solid var(--color-error)',
              color: 'var(--text-primary)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--color-error)' }}></i>
              <span>{horseSaveError}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsHorseModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar Registro</Button>
          </div>
        </form>
      </Modal>

      {/* Medical History Modal */}
      <Modal
        isOpen={isMedicalModalOpen}
        onClose={() => setIsMedicalModalOpen(false)}
        title={selectedHorse ? `Historial Médico: ${selectedHorse.nombre}` : "Historial Médico"}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Add Medical report (Only veterinarians or admins) */}
          {hasMedicalCreationRights() && (
            <div className="card" style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}>
              <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Registrar Evento Clínico
              </h4>
              <form onSubmit={handleAddMedicalEntry} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-row">
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Tipo de Evento</label>
                    <select
                      className="form-control"
                      value={medicalForm.tipo}
                      onChange={(e) => setMedicalForm(prev => ({ ...prev, tipo: e.target.value }))}
                      style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
                    >
                      <option value="vacuna">Vacuna</option>
                      <option value="tratamiento">Tratamiento</option>
                      <option value="alergia">Alergia</option>
                      <option value="observacion">Observación</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Médico Responsable</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Dr. Nombre Apellido"
                      value={medicalForm.responsableNombre}
                      onChange={(e) => setMedicalForm(prev => ({ ...prev, responsableNombre: e.target.value }))}
                    />
                    {medicalErrors.responsableNombre && <div className="form-feedback">{medicalErrors.responsableNombre}</div>}
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Detalles / Diagnóstico</label>
                  <textarea
                    className="form-control"
                    placeholder="Escriba los síntomas, dosis o detalles aquí..."
                    rows={2}
                    value={medicalForm.descripcion}
                    onChange={(e) => setMedicalForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  />
                  {medicalErrors.descripcion && <div className="form-feedback">{medicalErrors.descripcion}</div>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button type="submit" variant="success" icon="fa-solid fa-file-medical">
                    Agregar Reporte
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* List of medical entries */}
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Reportes Clínicos Anteriores</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
              {medicalHistory.length > 0 ? (
                medicalHistory.map(entry => (
                  <div key={entry.id} style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge ${getMedicalBadgeClass(entry.tipo)}`}>
                        {entry.tipo}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {entry.fecha}
                      </span>
                    </div>
                    <p style={{ margin: '0.25rem 0', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {entry.descripcion}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      Responsable: {entry.responsableNombre}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem' }}>
                  No hay antecedentes registrados para este equino.
                </p>
              )}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setIsMedicalModalOpen(false)}>Cerrar Ficha</Button>
          </div>
        </div>
      </Modal>
    </div>
  );

  function hasMedicalCreationRights() {
    return isRole.isAdmin() || isRole.isVeterinario();
  }

  function getMedicalBadgeClass(tipo) {
    switch (tipo) {
      case 'vacuna': return 'badge-info';
      case 'tratamiento': return 'badge-success';
      case 'alergia': return 'badge-error';
      default: return 'badge-warning';
    }
  }
};

export default Caballos;
