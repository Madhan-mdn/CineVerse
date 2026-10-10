import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Film, X } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MovieFilters from '../components/MovieFilters';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { LoadingSkeletonGrid } from '../components/LoadingSkeleton';
import { 
  discoverMovies, 
  searchMovies 
} from '../api/tmdb';

export default function ExploreMoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read URL query params
  const urlQuery = searchParams.get('q') || '';
  const urlGenre = searchParams.get('genre') || 'All Genres';
  const urlYear = searchParams.get('year') || 'Any Year';
  const urlRating = searchParams.get('rating') || 'Any Rating';
  const urlSort = searchParams.get('sort') || 'popularity.desc';
  const urlPage = parseInt(searchParams.get('page') || '1', 10);

  // Search input state
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [activeQuery, setActiveQuery] = useState(urlQuery);

  // 4 Filters state
  const [filters, setFilters] = useState({
    genre: urlGenre,
    year: urlYear,
    rating: urlRating,
    sortBy: urlSort
  });

  const [currentPage, setCurrentPage] = useState(urlPage);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);

  // Request race condition guard
  const latestRequestIdRef = useRef(0);

  // Sync internal state if URL parameters change from outside
  useEffect(() => {
    if (urlQuery !== activeQuery) {
      setActiveQuery(urlQuery);
      setSearchInput(urlQuery);
    }
    setFilters({
      genre: urlGenre,
      year: urlYear,
      rating: urlRating,
      sortBy: urlSort
    });
    setCurrentPage(urlPage);
  }, [urlQuery, urlGenre, urlYear, urlRating, urlSort, urlPage]);

  // Fetch movies whenever activeQuery, filters, or currentPage change
  const fetchMoviesData = useCallback(async () => {
    const requestId = ++latestRequestIdRef.current;
    setLoading(true);

    try {
      let data;
      if (activeQuery.trim()) {
        data = await searchMovies(activeQuery.trim(), currentPage);
      } else {
        data = await discoverMovies({
          genre: filters.genre,
          year: filters.year,
          rating: filters.rating,
          sortBy: filters.sortBy,
          page: currentPage
        });
      }

      // Check if this is still the latest request (prevent race conditions)
      if (requestId === latestRequestIdRef.current) {
        setMovies(data.movies || data.results || []);
        setTotalPages(Math.min(data.totalPages || 1, 500));
        setTotalResults(data.totalResults || (data.movies ? data.movies.length : 0));
      }
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      if (requestId === latestRequestIdRef.current) {
        setMovies([]);
        setTotalPages(1);
        setTotalResults(0);
      }
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [activeQuery, filters, currentPage]);

  useEffect(() => {
    fetchMoviesData();
  }, [fetchMoviesData]);

  // Update URL search parameters
  const updateUrlParams = (newFilters, newQuery, newPage = 1) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newFilters.genre && newFilters.genre !== 'All Genres') params.set('genre', newFilters.genre);
    if (newFilters.year && newFilters.year !== 'Any Year') params.set('year', newFilters.year);
    if (newFilters.rating && newFilters.rating !== 'Any Rating') params.set('rating', newFilters.rating);
    if (newFilters.sortBy && newFilters.sortBy !== 'popularity.desc') params.set('sort', newFilters.sortBy);
    if (newPage > 1) params.set('page', String(newPage));
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    const nextFilters = { ...filters, [key]: value };
    setFilters(nextFilters);
    setCurrentPage(1);
    // Clear active title search if user deliberately interacts with filters
    if (activeQuery) {
      setActiveQuery('');
      setSearchInput('');
      updateUrlParams(nextFilters, '', 1);
    } else {
      updateUrlParams(nextFilters, '', 1);
    }
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      genre: 'All Genres',
      year: 'Any Year',
      rating: 'Any Rating',
      sortBy: 'popularity.desc'
    };
    setFilters(defaultFilters);
    setActiveQuery('');
    setSearchInput('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    setActiveQuery(query);
    setCurrentPage(1);
    updateUrlParams(filters, query, 1);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveQuery('');
    setCurrentPage(1);
    updateUrlParams(filters, '', 1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateUrlParams(filters, activeQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-6">
        <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-1">
          Catalog & Discovery
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Explore Movies
        </h1>
        <p className="text-xs sm:text-sm text-cine-muted mt-1 max-w-2xl leading-relaxed">
          Search by title or filter by genre, release year, minimum rating, and sort order.
        </p>
      </div>

      {/* Title Search Bar */}
      <div className="mb-6 bg-surface p-3.5 sm:p-4 rounded-xl border border-surface-border shadow-card">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by movie title..."
              className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-surface-border bg-canvas text-xs sm:text-sm text-white focus:outline-none focus:border-cine-accent placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 cursor-pointer"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 sm:px-6 py-2.5 rounded-lg bg-cine-accent hover:bg-cine-accent-hover text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 cursor-pointer shadow-subtle"
          >
            Search
          </button>
        </form>

        {activeQuery && (
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-surface-border/60 pt-2.5">
            <span>
              Showing results for: <strong className="text-white">"{activeQuery}"</strong>
            </span>
            <button
              onClick={handleClearSearch}
              className="text-cine-accent hover:underline font-medium cursor-pointer"
            >
              Clear search & show filters
            </button>
          </div>
        )}
      </div>

      {/* 4 Filters Bar */}
      <MovieFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={totalResults}
      />

      {/* Active Filter Tags */}
      {(filters.genre !== 'All Genres' || filters.year !== 'Any Year' || filters.rating !== 'Any Rating') && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-cine-muted font-medium">Active filters:</span>
          {filters.genre !== 'All Genres' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-surface-border text-white">
              Genre: {filters.genre}
              <button onClick={() => handleFilterChange('genre', 'All Genres')} className="hover:text-cine-accent text-slate-400 ml-0.5">×</button>
            </span>
          )}
          {filters.year !== 'Any Year' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-surface-border text-white">
              Year: {filters.year}
              <button onClick={() => handleFilterChange('year', 'Any Year')} className="hover:text-cine-accent text-slate-400 ml-0.5">×</button>
            </span>
          )}
          {filters.rating !== 'Any Rating' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-surface-border text-white">
              Rating: {filters.rating}
              <button onClick={() => handleFilterChange('rating', 'Any Rating')} className="hover:text-cine-accent text-slate-400 ml-0.5">×</button>
            </span>
          )}
        </div>
      )}

      {/* Movie Grid, Skeletons, or Empty State */}
      {loading ? (
        <LoadingSkeletonGrid count={10} />
      ) : movies.length === 0 ? (
        <EmptyState
          title="No movies found"
          description="We couldn't find any movies matching your current search or filter combination. Try clearing your filters or searching for another title."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

    </div>
  );
}
