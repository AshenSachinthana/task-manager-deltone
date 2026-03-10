"use client";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  startItem: number;
  endItem: number;
  totalItems: number;
}

export default function Pagination({
  page,
  setPage,
  totalPages,
  startItem,
  endItem,
  totalItems,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing {startItem} &ndash; {endItem} of {totalItems} tasks
      </div>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            &lsaquo; Prev
          </button>
          {pages.map((p) => (
            <button
              key={p}
              className={`page-btn ${p === page ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next &rsaquo;
          </button>
        </div>
      )}
    </div>
  );
}
