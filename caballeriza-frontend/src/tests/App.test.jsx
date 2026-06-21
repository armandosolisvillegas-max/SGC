import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePagination } from '../hooks/usePagination';
import Button from '../components/ui/Button';

// Mock hook helper component to test usePagination
const PaginationTester = ({ items, perPage }) => {
  const { paginatedItems, currentPage, totalPages, nextPage, prevPage } = usePagination(items, perPage);
  return (
    <div>
      <div data-testid="page">{currentPage}</div>
      <div data-testid="total">{totalPages}</div>
      <ul data-testid="items">
        {paginatedItems.map(x => <li key={x}>{x}</li>)}
      </ul>
      <button data-testid="prev" onClick={prevPage}>Prev</button>
      <button data-testid="next" onClick={nextPage}>Next</button>
    </div>
  );
};

describe('Frontend Unit Tests', () => {
  describe('usePagination Hook', () => {
    it('should paginate items correctly', () => {
      const items = [1, 2, 3, 4, 5, 6, 7];
      render(<PaginationTester items={items} perPage={3} />);

      expect(screen.getByTestId('page').textContent).toBe('1');
      expect(screen.getByTestId('total').textContent).toBe('3');
      expect(screen.getByTestId('items').children.length).toBe(3);

      // Go to next page
      fireEvent.click(screen.getByTestId('next'));
      expect(screen.getByTestId('page').textContent).toBe('2');
      expect(screen.getByTestId('items').children.length).toBe(3);

      // Go to next page
      fireEvent.click(screen.getByTestId('next'));
      expect(screen.getByTestId('page').textContent).toBe('3');
      expect(screen.getByTestId('items').children.length).toBe(1);

      // Prev page
      fireEvent.click(screen.getByTestId('prev'));
      expect(screen.getByTestId('page').textContent).toBe('2');
    });
  });

  describe('Button Component', () => {
    it('renders with children and triggers onClick', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Enviar</Button>);

      const btn = screen.getByText('Enviar');
      expect(btn).toBeDefined();
      
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
      render(<Button disabled={true}>Deshabilitado</Button>);
      const btn = screen.getByText('Deshabilitado');
      expect(btn.disabled).toBe(true);
    });
  });
});
