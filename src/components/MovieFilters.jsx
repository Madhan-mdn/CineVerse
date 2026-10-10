import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { 
  GENRE_OPTIONS, 
  YEAR_OPTIONS, 
  RATING_OPTIONS, 
  SORT_OPTIONS 
} from '../api/tmdb';

export default function MovieFilters({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) {
  const hasActiveFilters = 
    filters.genre !== 'All Genres' ||
    filters.year !== 'Any Year' ||
    filters.rating !== 'Any Rating' ||
    filters.sortBy !== 'popularity.desc';

  return (
    <div className="bg-surface rounded-xl border border-surface-border p-4 sm:p-5 shadow-card mb-8">
      {/* Header with Title and Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cine-accent" />
          <h2 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide">
            Filter & Sort Movies
          </h2>
          {typeof totalResults === 'number' && (
            <span className="text-[11px] bg-surface-muted px-2.5 py-0.5 rounded-full text-cine-muted font-semibold hidden sm:inline border border-surface-border">
              {totalResults.toLocaleString()} {totalResults === 1 ? 'title' : 'titles'}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-cine-accent hover:text-red-400 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* 4 Clean Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Genre Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => onFilterChange('genre', e.target.value)}
            className="w-full bg-canvas border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cine-accent transition-colors"
          >
            {GENRE_OPTIONS.map(g => (
              <option key={g} value={g} className="bg-surface text-white">
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Release Year Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Release Year
          </label>
          <select
            value={filters.year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            className="w-full bg-canvas border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cine-accent transition-colors"
          >
            {YEAR_OPTIONS.map(y => (
              <option key={y} value={y} className="bg-surface text-white">
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Minimum Rating Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Minimum Rating
          </label>
          <select
            value={filters.rating}
            onChange={(e) => onFilterChange('rating', e.target.value)}
            className="w-full bg-canvas border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cine-accent transition-colors"
          >
            {RATING_OPTIONS.map(r => (
              <option key={r} value={r} className="bg-surface text-white">
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Sort Options */}
        <div>
          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="w-full bg-canvas border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cine-accent transition-colors"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value} className="bg-surface text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
