import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { caballoApi } from '../../api/caballoApi';
import { alimentacionApi, inventarioApi } from '../../api/apiModules';
import usePagination from '../../hooks/usePagination';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export const Alimentacion = () => {
  const navigate = useNavigate();
  const [horses, setHorses] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [supplyLogs, setSupplyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Nutrition Plan Modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [planForm, setPlanForm] = useState({ descripcion: '', frecuencia: '', insumoId: '' });
  const [planErrors, setPlanErrors] = useState({});

  // Log Feeding Modal
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [feedingForm, setFeedingForm] = useState({ planId: '', cantidad: '', tipo: 'alimento' });
  const [feedingErrors, setFeedingErrors] = useState({});
  const [feedingHorseName, setFeedingHorseName] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [horsesList, suppliesList, logsList] = await Promise.all([
        caballoApi.getAll(),
        inventarioApi.getAll(),
        alimentacionApi.getLogs()
      ]);

      // Enrich horse list with feeding plan
      const enrichedHorses = await Promise.all(
        horsesList.map(async (horse) => {
          const plan = await alimentacionApi.getPlanByCaballo(horse.id);
          const insumo = plan ? suppliesList.find(i => i.id === Number(plan.insumoId)) : null;
          return {
            ...horse,
            plan: plan || null,
            insumoNombre: insumo ? insumo.nombre : 'No especificado'
          };
        })
      );

      setHorses(enrichedHorses);
      setSupplies(suppliesList);
      setSupplyLogs(logsList.reverse()); // latest first
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const horsePagination = usePagination(horses, 5);
  const logsPagination = usePagination(supplyLogs, 5);

  // Edit nutrition plan
  const openPlanModal = (horse) => {
    setSelectedHorse(horse);
    setPlanForm({
      descripcion: horse.plan?.descripcion || '',
      frecuencia: horse.plan?.frecuencia || 'Diario (Mañana y Tarde)',
      insumoId: horse.plan?.insumoId || (supplies.length > 0 ? supplies[0].id : '')
    });
    setPlanErrors({});
    setIsPlanModalOpen(true);
  };

  const validatePlan = () => {
    const err = {};
    if (!planForm.descripcion.trim()) err.descripcion = 'La descripción es obligatoria.';
    if (!planForm.frecuencia.trim()) err.frecuencia = 'La frecuencia es obligatoria.';
    if (!planForm.insumoId) err.insumoId = 'Debe vincular un insumo del inventario.';
    setPlanErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!validatePlan()) return;

    try {
      await alimentacionApi.savePlan(selectedHorse.id, planForm);
      setIsPlanModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Log Feeding Suministro
  const openFeedingModal = (horse) => {
    if (!horse.plan) {
      alert("Primero debe asignar un Plan de Alimentación a este caballo.");
      return;
    }
    setFeedingHorseName(horse.nombre);
    setFeedingForm({
      planId: horse.plan.id,
      cantidad: '',
      tipo: 'alimento'
    });
    setFeedingErrors({});
    setIsFeedModalOpen(true);
  };

  const validateFeeding = () => {
    const err = {};
    const cantNum = Number(feedingForm.cantidad);
    if (!feedingForm.cantidad) err.cantidad = 'La cantidad suministrada es obligatoria.';
    else if (isNaN(cantNum) || cantNum <= 0) err.cantidad = 'Debe ser un número mayor a 0.';
    setFeedingErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleLogFeeding = async (e) => {
    e.preventDefault();
    if (!validateFeeding()) return;

    try {
      await alimentacionApi.logSuministro(feedingForm.planId, {
        cantidad: feedingForm.cantidad,
        tipo: feedingForm.tipo
      });
      setIsFeedModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const renderHorseRow = (horse) => (
    <tr key={horse.id}>
      <td><strong>{horse.nombre}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({horse.identificador})</span></td>
      <td>
        {horse.plan ? (
          <div>
            <div style={{ fontWeight: 500 }}>{horse.plan.descripcion}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>Frecuencia: {horse.plan.frecuencia}</div>
          </div>
        ) : (
          <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>Sin plan asignado</span>
        )}
      </td>
      <td>{horse.insumoNombre}</td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => openPlanModal(horse)} style={{ padding: '0.4rem 0.6rem' }} icon="fa-solid fa-pen-to-square">
            Definir Plan
          </Button>
          <Button variant="success" onClick={() => openFeedingModal(horse)} disabled={!horse.plan} style={{ padding: '0.4rem 0.6rem' }} icon="fa-solid fa-wheat-awn">
            Racionar
          </Button>
        </div>
      </td>
    </tr>
  );

  const renderLogRow = (log) => (
    <tr key={log.id}>
      <td>{log.fecha}</td>
      <td><strong>{log.caballoNombre}</strong></td>
      <td>
        <span className={`badge ${log.tipo === 'medicina' ? 'badge-info' : 'badge-success'}`}>
          {log.tipo}
        </span>
      </td>
      <td>{log.cantidad} kg / dosis</td>
    </tr>
  );

  if (loading && horses.length === 0) {
    return (
      <div style={{ display: 'flex', justifySelf: 'center', alignSelf: 'center', padding: '5rem' }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: 'var(--accent-gold)' }}></i>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
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
            <h1>Nutrición & Suministros</h1>
            <p>Planifica la dieta de los caballos y registra la ración diaria debitándola del inventario.</p>
          </div>
        </div>
      </div>

      {/* Table: Horses Diet Plans */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card-header">
          <h3>Dieta y Planes por Equino</h3>
          <i className="fa-solid fa-horse-head" style={{ color: 'var(--accent-gold)' }}></i>
        </div>
        <Table
          headers={['Caballo', 'Plan Nutricional', 'Insumo Vinculado', 'Acciones']}
          data={horsePagination.paginatedItems}
          renderRow={renderHorseRow}
          pagination={horsePagination}
        />
      </div>

      {/* Table: Feeding History */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card-header">
          <h3>Historial de Racionamiento Reciente</h3>
          <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--text-secondary)' }}></i>
        </div>
        <Table
          headers={['Fecha', 'Caballo', 'Tipo de Insumo', 'Cantidad de Ración']}
          data={logsPagination.paginatedItems}
          renderRow={renderLogRow}
          pagination={logsPagination}
        />
      </div>

      {/* Edit nutrition plan modal */}
      <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title={`Configurar Plan: ${selectedHorse?.nombre}`}>
        <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Descripción del Alimento / Dieta</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej. Alfalfa fresca picada con 500g concentrado"
              value={planForm.descripcion}
              onChange={(e) => setPlanForm(prev => ({ ...prev, descripcion: e.target.value }))}
            />
            {planErrors.descripcion && <div className="form-feedback">{planErrors.descripcion}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Frecuencia de Ración</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej. Diario (Mañana y Tarde)"
              value={planForm.frecuencia}
              onChange={(e) => setPlanForm(prev => ({ ...prev, frecuencia: e.target.value }))}
            />
            {planErrors.frecuencia && <div className="form-feedback">{planErrors.frecuencia}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Insumo del Inventario (Para restar stock)</label>
            <select
              className="form-control"
              value={planForm.insumoId}
              onChange={(e) => setPlanForm(prev => ({ ...prev, insumoId: e.target.value }))}
              style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
            >
              <option value="">Seleccionar insumo...</option>
              {supplies.map(s => (
                <option key={s.id} value={s.id}>{s.nombre} ({s.stockActual}kg / u disponibles)</option>
              ))}
            </select>
            {planErrors.insumoId && <div className="form-feedback">{planErrors.insumoId}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsPlanModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar Dieta</Button>
          </div>
        </form>
      </Modal>

      {/* Log Feeding suministro modal */}
      <Modal isOpen={isFeedModalOpen} onClose={() => setIsFeedModalOpen(false)} title={`Registrar Ración para ${feedingHorseName}`}>
        <form onSubmit={handleLogFeeding} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cantidad Suministrada (kg / unidades)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Ej. 2.5"
                value={feedingForm.cantidad}
                onChange={(e) => setFeedingForm(prev => ({ ...prev, cantidad: e.target.value }))}
              />
              {feedingErrors.cantidad && <div className="form-feedback">{feedingErrors.cantidad}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de Ración</label>
              <select
                className="form-control"
                value={feedingForm.tipo}
                onChange={(e) => setFeedingForm(prev => ({ ...prev, tipo: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
              >
                <option value="alimento">Alimento</option>
                <option value="medicina">Medicina</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsFeedModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="success">Registrar Suministro</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Alimentacion;
