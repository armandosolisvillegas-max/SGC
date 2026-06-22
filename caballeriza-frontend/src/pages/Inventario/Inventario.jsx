import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { inventarioApi } from '../../api/apiModules';
import usePagination from '../../hooks/usePagination';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

export const Inventario = () => {
  const navigate = useNavigate();
  const [supplies, setSupplies] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Insumo Add/Edit Form Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);
  const [insumoForm, setInsumoForm] = useState({
    nombre: '', tipo: 'alimento', stockActual: '', stockMinimo: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchSupplies = async () => {
    try {
      setLoading(true);
      const data = await inventarioApi.getAll();
      setSupplies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplies();
  }, []);

  const filteredSupplies = supplies.filter(s => 
    s.nombre.toLowerCase().includes(search.toLowerCase()) || 
    s.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const pagination = usePagination(filteredSupplies, 6);

  const validate = () => {
    const err = {};
    if (!insumoForm.nombre.trim()) err.nombre = 'El nombre es obligatorio.';
    
    const stockNum = Number(insumoForm.stockActual);
    if (insumoForm.stockActual === '') err.stockActual = 'El stock es obligatorio.';
    else if (isNaN(stockNum) || stockNum < 0) err.stockActual = 'Debe ser un número positivo.';

    const minNum = Number(insumoForm.stockMinimo);
    if (insumoForm.stockMinimo === '') err.stockMinimo = 'El stock mínimo es obligatorio.';
    else if (isNaN(minNum) || minNum < 0) err.stockMinimo = 'Debe ser un número positivo.';

    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSaveInsumo = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editingInsumo) {
        await inventarioApi.update(editingInsumo.id, insumoForm);
      } else {
        await inventarioApi.create(insumoForm);
      }
      setIsModalOpen(false);
      fetchSupplies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInsumo = async (id) => {
    if (window.confirm('¿Seguro que desea eliminar este insumo del inventario?')) {
      try {
        await inventarioApi.delete(id);
        fetchSupplies();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const openAddModal = () => {
    setEditingInsumo(null);
    setInsumoForm({ nombre: '', tipo: 'alimento', stockActual: '', stockMinimo: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (insumo) => {
    setEditingInsumo(insumo);
    setInsumoForm({
      nombre: insumo.nombre,
      tipo: insumo.tipo,
      stockActual: insumo.stockActual,
      stockMinimo: insumo.stockMinimo
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const renderInsumoRow = (insumo) => {
    const isLow = insumo.stockActual < insumo.stockMinimo;

    return (
      <tr key={insumo.id} style={{ backgroundColor: isLow ? 'rgba(239, 68, 68, 0.02)' : 'inherit' }}>
        <td><strong>{insumo.nombre}</strong></td>
        <td>
          <span className={`badge ${insumo.tipo === 'medicina' ? 'badge-info' : 'badge-success'}`}>
            {insumo.tipo}
          </span>
        </td>
        <td>
          <span style={{ fontWeight: 600, color: isLow ? 'var(--color-error)' : 'inherit' }}>
            {insumo.stockActual}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}> {insumo.tipo === 'alimento' ? 'kg' : 'unidades'}</span>
        </td>
        <td>
          <span>{insumo.stockMinimo}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}> {insumo.tipo === 'alimento' ? 'kg' : 'unidades'}</span>
        </td>
        <td>
          {isLow ? (
            <span className="badge badge-error">
              <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '0.4rem' }}></i>Stock Bajo
            </span>
          ) : (
            <span className="badge badge-success">Suficiente</span>
          )}
        </td>
        <td>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button variant="secondary" onClick={() => openEditModal(insumo)} style={{ padding: '0.4rem 0.6rem' }} icon="fa-solid fa-pen-to-square">
              Ajustar
            </Button>
            <Button variant="danger" onClick={() => handleDeleteInsumo(insumo.id)} style={{ padding: '0.4rem 0.6rem', backgroundColor: 'transparent', borderColor: 'var(--color-error)', color: 'var(--color-error)' }} icon="fa-solid fa-trash">
              Eliminar
            </Button>
          </div>
        </td>
      </tr>
    );
  };

  if (loading && supplies.length === 0) {
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
            <h1>Inventario de Insumos</h1>
            <p>Supervisa el stock disponible de alimentos, heno y medicamentos veterinarios.</p>
          </div>
        </div>
        <Button onClick={openAddModal} icon="fa-solid fa-box-archive">
          Registrar Insumo
        </Button>
      </div>

      {/* Search card */}
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
            placeholder="Buscar insumo por nombre o tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      {/* Supplies Table */}
      <Table
        headers={['Insumo / Nombre', 'Tipo de Insumo', 'Stock Actual', 'Stock Mínimo (Alerta)', 'Estado', 'Acciones']}
        data={pagination.paginatedItems}
        renderRow={renderInsumoRow}
        pagination={pagination}
      />

      {/* Add/Edit Insumo Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingInsumo ? "Ajustar Stock del Insumo" : "Registrar Insumo Nuevo"}>
        <form onSubmit={handleSaveInsumo} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Nombre del Insumo</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej. Heno de Alfalfa de corte"
              value={insumoForm.nombre}
              onChange={(e) => setInsumoForm(prev => ({ ...prev, nombre: e.target.value }))}
            />
            {formErrors.nombre && <div className="form-feedback">{formErrors.nombre}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Categoría / Tipo</label>
            <select
              className="form-control"
              value={insumoForm.tipo}
              onChange={(e) => setInsumoForm(prev => ({ ...prev, tipo: e.target.value }))}
              style={{ backgroundColor: 'var(--bg-primary)', color: 'white' }}
            >
              <option value="alimento">Alimento (Heno / Concentrado / etc)</option>
              <option value="medicina">Medicina (Vacuna / Desparasitante / etc)</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stock Actual (kg o unidades)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Ej. 100"
                value={insumoForm.stockActual}
                onChange={(e) => setInsumoForm(prev => ({ ...prev, stockActual: e.target.value }))}
              />
              {formErrors.stockActual && <div className="form-feedback">{formErrors.stockActual}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Stock de Alerta Mínimo</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Ej. 25"
                value={insumoForm.stockMinimo}
                onChange={(e) => setInsumoForm(prev => ({ ...prev, stockMinimo: e.target.value }))}
              />
              {formErrors.stockMinimo && <div className="form-feedback">{formErrors.stockMinimo}</div>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">Guardar Insumo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventario;
