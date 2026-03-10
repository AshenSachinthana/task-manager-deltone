"use client";

import { useState, useCallback, useEffect } from "react";

const ITEMS_PER_PAGE = 5;

export default function usePagination(totalItems: number) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const resetPage = useCallback(() => setPage(1), []);

  const paginateItems = useCallback(
    <T,>(items: T[]): T[] => {
      const start = (page - 1) * ITEMS_PER_PAGE;
      return items.slice(start, start + ITEMS_PER_PAGE);
    },
    [page]
  );

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, totalItems);

  return {
    page,
    setPage,
    totalPages,
    resetPage,
    paginateItems,
    startItem,
    endItem,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}
