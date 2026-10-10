import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  // Max 500 pages per TMDB specs
  const maxPage = Math.min(totalPages, 500);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= maxPage && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2; // numbers on each side of currentPage

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(maxPage - 1, currentPage + delta); i++) {
      pages.push(i);
    }

    const items = [1];
    if (pages.length > 0 && pages[0] > 2) {
      items.push('...');
    }
    items.push(...pages);
    if (pages.length > 0 && pages[pages.length - 1] < maxPage - 1) {
      items.push('...');
    }
    if (maxPage > 1 && !items.includes(maxPage)) {
      items.push(maxPage);
    }

    return items;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1.5 sm:gap-2 my-12" aria-label="Pagination">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3.5 py-2 rounded-lg border border-surface-border bg-surface text-slate-300 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-muted hover:text-white transition-colors flex items-center gap-1 shadow-subtle cursor-pointer"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Number Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {pageNumbers.map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs text-cine-muted font-bold select-none">
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => handlePageClick(p)}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-cine-accent text-white shadow-card border border-cine-accent'
                  : 'bg-surface border border-surface-border text-slate-300 hover:text-white hover:bg-surface-muted'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= maxPage}
        className="px-3.5 py-2 rounded-lg border border-surface-border bg-surface text-slate-300 text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-muted hover:text-white transition-colors flex items-center gap-1 shadow-subtle cursor-pointer"
        aria-label="Next Page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
