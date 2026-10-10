import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Film, 
  Sparkles,
  ChevronDown,
  Filter
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { MOVIES, GENRES } from '../data/moviesData';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [minRating, setMinRating] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Keep query input in sync if URL param changes
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const resetFilters = () => {
    setSelectedGenre('All');
    setSelectedYear('All');
    setMinRating('All');
    setSelectedLanguage('All');
    setSortBy('rating-desc');
    setQuery('');
    setSearchParams({});
  };

  // Filter & sort logic
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      // Query match (title, director, cast, overview, tags)
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesDirector = movie.director.toLowerCase().includes(q);
        const matchesCast = movie.cast?.some(c => c.name.toLowerCase().includes(q));
        const matchesGenre = movie.genres.some(g => g.toLowerCase().includes(q));
        const matchesOverview = movie.overview.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDirector && !matchesCast && !matchesGenre && !matchesOverview) {
          return false;
        }
      }

      // Genre filter
      if (selectedGenre !== 'All') {
        if (!movie.genres.includes(selectedGenre)) return false;
      }

      // Year filter
      if (selectedYear !== 'All') {
        if (selectedYear === '2024+' && movie.year < 2024) return false;
        if (selectedYear === '2020-2023' && (movie.year < 2020 || movie.year > 2023)) return false;
        if (selectedYear === '2010s' && (movie.year < 2010 || movie.year > 2019)) return false;
        if (selectedYear === 'classic' && movie.year >= 2010) return false;
      }

      // Minimum Rating
      if (minRating !== 'All') {
        const threshold = parseFloat(minRating);
        if (movie.rating < threshold) return false;
      }

      // Language
      if (selectedLanguage !== 'All') {
        if (!movie.language.toLowerCase().includes(selectedLanguage.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'rating-asc') return a.rating - b.rating;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'year-asc') return a.year - b.year;
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [query, selectedGenre, selectedYear, minRating, selectedLanguage, sortBy]);

  const activeFilterCount = [
    selectedGenre !== 'All',
    selectedYear !== 'All',
    minRating !== 'All',
    selectedLanguage !== 'All'
  ].filter(Boolean).length;

  const filterControlsContent = (
    <div className="space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-cine-border">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cine-accent" />
          <h2 className="font-semibold text-xs uppercase tracking-wider text-cine-dark">
            Filter Parameters
          </h2>
        </div>
        {(activeFilterCount > 0 || query) && (
          <button
            onClick={resetFilters}
            className="text-[11px] font-semibold text-cine-accent hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Genre Filter */}
      <div>
        <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
          Genre
        </label>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
        >
          {GENRES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Release Year Filter */}
      <div>
        <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
          Release Era
        </label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
        >
          <option value="All">All Years</option>
          <option value="2024+">2024 – 2025 (Latest Releases)</option>
          <option value="2020-2023">2020 – 2023</option>
          <option value="2010s">2010s (2010 – 2019)</option>
          <option value="classic">Classic Cinema (&lt; 2010)</option>
        </select>
      </div>

      {/* Minimum Rating Filter */}
      <div>
        <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
          Minimum Rating
        </label>
        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
        >
          <option value="All">Any Critical Score</option>
          <option value="8.5">⭐ 8.5+ (Masterpiece)</option>
          <option value="8.0">⭐ 8.0+ (Universal Acclaim)</option>
          <option value="7.5">⭐ 7.5+ (Recommended)</option>
          <option value="7.0">⭐ 7.0+ (Solid)</option>
        </select>
      </div>

      {/* Language Filter */}
      <div>
        <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
          Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
        >
          <option value="All">All Languages</option>
          <option value="English">English</option>
          <option value="Japanese">Japanese</option>
          <option value="Swedish">Swedish</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
          Sort Order
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
        >
          <option value="rating-desc">Rating: Highest First</option>
          <option value="rating-asc">Rating: Lowest First</option>
          <option value="year-desc">Release Year: Newest</option>
          <option value="year-asc">Release Year: Oldest</option>
          <option value="title-asc">Title: A to Z</option>
        </select>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="pt-2 border-t border-cine-border">
          <div className="text-[11px] text-cine-muted mb-2 font-medium">Active filters:</div>
          <div className="flex flex-wrap gap-1.5">
            {selectedGenre !== 'All' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-surface-muted text-cine-dark px-2 py-0.5 rounded border border-cine-border">
                {selectedGenre}
                <button onClick={() => setSelectedGenre('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedYear !== 'All' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-surface-muted text-cine-dark px-2 py-0.5 rounded border border-cine-border">
                {selectedYear}
                <button onClick={() => setSelectedYear('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {minRating !== 'All' && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-surface-muted text-cine-dark px-2 py-0.5 rounded border border-cine-border">
                {minRating}+
                <button onClick={() => setMinRating('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Top Search Bar Banner */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-cine-dark mb-1.5 sm:mb-2">
          Search The Archive
        </h1>
        <p className="text-xs sm:text-sm text-cine-muted mb-5 max-w-xl">
          Query across film titles, directors, actors, synopses, and technical specs.
        </p>

        <div className="relative max-w-3xl">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search by title, director (e.g. Christopher Nolan, Denis Villeneuve), or actor..."
            className="w-full bg-surface border border-cine-border rounded-lg pl-10 sm:pl-11 pr-10 py-3 sm:py-3.5 text-xs sm:text-sm text-cine-dark placeholder-cine-muted shadow-card focus:outline-none focus:ring-1 focus:ring-cine-accent focus:border-cine-accent transition-all"
          />
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-cine-muted absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cine-muted hover:text-cine-dark p-1 rounded-full hover:bg-surface-muted"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Filter Bar (< lg) */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-surface rounded-lg border border-cine-border mb-6 shadow-subtle">
        <span className="text-xs font-semibold text-cine-dark">
          {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'} found
        </span>

        <button
          onClick={() => setFilterDrawerOpen(true)}
          className="px-3.5 py-1.5 rounded-md bg-cine-dark text-white text-xs font-semibold flex items-center gap-1.5 shadow-subtle"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters ({activeFilterCount})</span>
        </button>
      </div>

      {/* Main 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Filter Sidebar (Desktop >= lg, 3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 bg-surface rounded-lg border border-cine-border p-5 shadow-subtle">
          {filterControlsContent}
        </aside>

        {/* Right Column: Results Area (9 cols on lg, full width on tablet/mobile) */}
        <main className="lg:col-span-9">
          
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-cine-border">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-cine-dark">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'Film' : 'Films'} Found
              </span>
              {query && (
                <span className="text-xs text-cine-muted truncate max-w-[200px] sm:max-w-none">
                  matching "<span className="text-cine-dark font-medium">{query}</span>"
                </span>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-cine-muted">
              <span>Sorted by:</span>
              <span className="text-cine-dark font-medium capitalize">
                {sortBy.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Results Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-surface rounded-xl border border-cine-border shadow-subtle">
              <Film className="w-12 h-12 text-cine-muted mx-auto mb-4 stroke-1" />
              <h3 className="font-serif text-xl font-bold text-cine-dark mb-2">
                No films matched your parameters
              </h3>
              <p className="text-xs sm:text-sm text-cine-muted max-w-md mx-auto mb-6">
                Try widening your filters or exploring different keywords. Search for directors like Christopher Nolan or Denis Villeneuve.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-md bg-cine-dark text-white text-xs font-medium hover:bg-cine-accent transition-colors"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => handleQueryChange('Sci-Fi')}
                  className="px-3.5 py-2 rounded-md border border-cine-border bg-canvas text-xs font-medium text-cine-body hover:bg-surface-muted transition-colors"
                >
                  Explore "Sci-Fi"
                </button>
                <button
                  onClick={() => handleQueryChange('Villeneuve')}
                  className="px-3.5 py-2 rounded-md border border-cine-border bg-canvas text-xs font-medium text-cine-body hover:bg-surface-muted transition-colors"
                >
                  Explore "Denis Villeneuve"
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* Off-canvas Filter Drawer for Mobile & Tablet */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setFilterDrawerOpen(false)}
          />

          {/* Slide-over panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-surface h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-cine-border">
                <span className="font-serif text-lg font-bold text-cine-dark">
                  Filters & Sorting
                </span>
                <button
                  onClick={() => setFilterDrawerOpen(false)}
                  className="p-1 rounded text-cine-muted hover:text-cine-dark"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {filterControlsContent}
            </div>

            <div className="pt-6 mt-6 border-t border-cine-border">
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-2.5 rounded-md bg-cine-dark text-white text-xs font-semibold hover:bg-cine-accent transition-colors shadow-subtle"
              >
                Apply & View ({filteredMovies.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
