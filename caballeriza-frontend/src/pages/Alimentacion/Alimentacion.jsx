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
  const [plans, setPlans] = useState([]);
  const [supplyLogs, setSupplyLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Plan Modal (create/edit)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({ descripcion: '', frecuencia: '', insumoId: '', caballoId: '' });
  const [planErrors, setPlanErrors] = useState({});

  // Log Feeding Modal
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);
  const [feedingForm, setFeedingForm] = useState({ planId: '', cantidad: '', tipo: 'alimento' });
  const [feedingErrors, setFeedingErrors] = useState({});
  const [feedingHorseName, setFeedingHorseName] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [horsesList, suppliesList, plansList, logsList] = await Promise.all([
        caballoApi.getAll(),
        inventarioApi.getAll(),
        alimentacionApi.getAllPlanes(),
        alimentacionApi.getLogs()
      ]);

      setHorses(horsesList);
      setSupplies(suppliesList);
      setPlans(plansList);
      setSupplyLogs(Array.isArray(logsList) ? [...logsList].reverse() : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const plansPagination = usePagination(plans, 8);
  const logsPagination = usePagination(supplyLogs, 5);

  // --- Plan CRUD ---
  const openAddPlanModal = () => {
    setPlanForm({
      descripcion: '',
      frecuencia: 'Diario (Mañana y Tarde)',
      insumoId: supplies.length > 0 ? supplies[0].id : '',
      caballoId: horses.length > 0 ? horses[0].id : ''
    });
    setPlanErrors({});
    setIsEditingPlan(false);
    setEditingPlanId(null);
    setIsPlanModalOpen(true);
  };

  const openEditPlanModal = (plan) => {
    setPlanForm({
      descripcion: plan.descripcion || '',
      frecuencia: plan.frecuencia || 'Diario (Mañana y Tarde)',
      insumoId: plan.insumoId || (supplies.length > 0 ? supplies[0].id : ''),
      caballoId: plan.caballoId || ''
    });
    setPlanErrors({});
    setIsEditingPlan(true);
    setEditingPlanId(plan.id);
    setIsPlanModalOpen(true);
  };

  const validatePlan = () => {
    const err = {};
    if (!planForm.descripcion.trim()) err.descripcion = 'La descripción es obligatoria.';
    if (!planForm.frecuencia.trim()) err.frecuencia = 'La frecuencia es obligatoria.';
    if (!planForm.insumoId) err.insumoId = 'Debe vincular un insumo del inventario.';
    if (!isEditingPlan && !planForm.caballoId) err.caballoId = 'Debe seleccionar un caballo.';
    setPlanErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!validatePlan()) return;
    try {
      if (isEditingPlan) {
        await alimentacionApi.updatePlan(editingPlanId, planForm);
      } else {
        await alimentacionApi.savePlan(planForm.caballoId, planForm);
      }
      setIsPlanModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('¿Está seguro que desea eliminar este plan de alimentación?')) {
      try {
        await alimentacionApi.deletePlan(planId);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // --- Feeding Log ---
  const openFeedingModal = (plan) => {
    setFeedingHorseName(plan.caballoNombre || 'Caballo');
    setFeedingForm({
      planId: plan.id,
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

  // --- Render Rows ---
  const renderPlanRow = (plan) => (
    <tr key={plan.id}>
      <td><strong>{plan.caballoNombre || 'N/A'}</strong></td>
      <td>
        <div>
          <div style={{ fontWeight: 500 }}>{plan.descripcion}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)' }}>Frecuencia: {plan.frecuencia}</div>
        </div>
      </td>
      <td>
        {plan.insumoNombre ? (
          <span className="badge badge-success">{plan.insumoNombre}</span>
        ) : (
          <span style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>No especificado</span>
        )}
      </td>
      <td>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button variant="secondary" onClick={() => openEditPlanModal(plan)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} icon="fa-solid fa-pen-to-square">
            Editar
          </Button>
          <Button variant="success" onClick={() => openFeedingModal(plan)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }} icon="fa-solid fa-wheat-awn">
            Racionar
          </Button>
          <Button variant="danger" onClick={() => handleDeletePlan(plan.id)} style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>
            <i className="fa-solid fa-trash-can"></i>
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

  if (loading && plans.length === 0) {
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
        <Button onClick={openAddPlanModal} icon="fa-solid fa-plus">
          Agregar Dieta
        </Button>
      </div>

      {/* Table: Diet Plans */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card-header">
          <h3>Dieta y Planes por Equino</h3>
          <i className="fa-solid fa-horse-head" style={{ color: 'var(--accent-gold)' }}></i>
        </div>
        <Table
          headers={['Caballo', 'Plan Nutricional', 'Insumo Vinculado', 'Acciones']}
          data={plansPagination.paginatedItems}
          renderRow={renderPlanRow}
          pagination={plansPagination}
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

      {/* Create / Edit Plan Modal */}
      <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title={isEditingPlan ? 'Editar Plan de Alimentación' : 'Agregar Nueva Dieta'}>
        <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isEditingPlan && (
            <div className="form-group">
              <label className="form-label">Caballo</label>
              <select
                className="form-control"
                value={planForm.caballoId}
                onChange={(e) => setPlanForm(prev => ({ ...prev, caballoId: e.target.value }))}
                style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
              >
                <option value="">Seleccionar caballo...</option>
                {horses.map(h => (
                  <option key={h.id} value={h.id}>{h.nombre} ({h.identificador})</option>
                ))}
              </select>
              {planErrors.caballoId && <div className="form-feedback">{planErrors.caballoId}</div>}
            </div>
          )}

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
            <Button type="submit">{isEditingPlan ? 'Guardar Cambios' : 'Agregar Dieta'}</Button>
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
