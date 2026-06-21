import React from 'react';

export const Table = ({ headers = [], data = [], renderRow, pagination }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  <i className="fa-regular fa-folder-open fa-2x" style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}></i>
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Mostrando página <strong>{pagination.currentPage}</strong> de {pagination.totalPages} ({pagination.totalItems} registros)
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={pagination.prevPage}
              disabled={pagination.currentPage === 1}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <i className="fa-solid fa-chevron-left"></i> Anterior
            </button>
            <button
              onClick={pagination.nextPage}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              Siguiente <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
