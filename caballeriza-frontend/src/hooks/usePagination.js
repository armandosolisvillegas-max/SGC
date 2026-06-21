import { useState } from 'react';

export const usePagination = (items = [], itemsPerPage = 5) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const setPage = (pageNumber) => {
    const pageIdx = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(pageIdx);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    setPage,
    paginatedItems,
    itemsPerPage,
    totalItems: items.length
  };
};

export default usePagination;
