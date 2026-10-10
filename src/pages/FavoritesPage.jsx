import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  Search,
  Bookmark
} from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites, clearFavorites, favoritesCount, watchlistCount } = useMovieContext();

  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'rating', 'year', 'title'

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return favorites.filter(item => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesOverview = item.overview?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesOverview) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(b.addedAt || 0) - new Date(a.addedAt || 0);
    });
  }, [favorites, searchFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-surface-border">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-rose-500 uppercase block mb-1">
            Personal Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Favorites
          </h1>
          <p className="text-xs sm:text-sm text-cine-muted mt-1">
            {favoritesCount} {favoritesCount === 1 ? 'film' : 'films'} you loved and marked as your all-time favorites.
          </p>
        </div>

        {/* Watchlist & Favorites Switcher */}
        <div className="flex items-center gap-2">
          <Link
            to="/watchlist"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-surface hover:bg-surface-muted text-slate-300 hover:text-white border border-surface-border flex items-center gap-1.5 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Watchlist ({watchlistCount})</span>
          </Link>
          <Link
            to="/favorites"
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white border border-rose-600 flex items-center gap-1.5 shadow-subtle"
          >
            <Heart className="w-3.5 h-3.5 fill-white text-white" />
            <span>Favorites ({favoritesCount})</span>
          </Link>
        </div>
      </div>

      {favoritesCount === 0 ? (
        <EmptyState
          title="No Favorites Saved Yet"
          description="You haven't added any favorite movies yet. When browsing movies, tap the heart icon on any movie card or detail page to add it to your personal favorites collection."
          actionText="Explore Movies Now"
          onAction={() => navigate('/explore')}
        />
      ) : (
        <>
          {/* Controls Bar: Search, Sort, Clear */}
          <div className="bg-surface rounded-xl border border-surface-border p-4 mb-8 shadow-card flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
              {/* Search within favorites */}
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search in your favorites..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-canvas border border-surface-border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cine-accent"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Sort selector */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-canvas border border-surface-border rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-cine-accent"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Highest Rating</option>
                <option value="year">Release Year</option>
                <option value="title">Movie Title (A-Z)</option>
              </select>
            </div>

            {/* Clear Entire Favorites */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to remove all movies from your favorites?")) {
                  clearFavorites();
                }
              }}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 font-medium transition-colors cursor-pointer self-end sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Favorites</span>
            </button>
          </div>

          {/* Filtered Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-xl border border-surface-border">
              <p className="text-sm font-semibold text-white mb-1">No matches found</p>
              <p className="text-xs text-cine-muted mb-4">No movies in your favorites match your current search.</p>
              <button
                onClick={() => setSearchFilter('')}
                className="text-xs font-semibold text-cine-accent hover:underline cursor-pointer"
              >
                Reset search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredItems.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
