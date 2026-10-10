import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Sparkles, 
  Dices, 
  SlidersHorizontal, 
  RotateCcw, 
  Clock, 
  Star,
  Film
} from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { MOVIES, GENRES, MOODS, ERAS } from '../data/moviesData';

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const moodParam = searchParams.get('mood') || 'all';
  const genreParam = searchParams.get('genre') || 'All';
  const eraParam = searchParams.get('era') || 'all';

  const [selectedMood, setSelectedMood] = useState(moodParam);
  const [selectedGenre, setSelectedGenre] = useState(genreParam);
  const [selectedEra, setSelectedEra] = useState(eraParam);
  const [maxRuntime, setMaxRuntime] = useState('all'); // 'under-120', '120-150', 'over-150'
  const [minRating, setMinRating] = useState('all');
  const [sortBy, setSortBy] = useState('rating-desc');
  const [surpriseMovie, setSurpriseMovie] = useState(null);

  // Sync state if URL query params change
  useEffect(() => {
    if (moodParam) setSelectedMood(moodParam);
    if (genreParam) setSelectedGenre(genreParam);
    if (eraParam) setSelectedEra(eraParam);
  }, [moodParam, genreParam, eraParam]);

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (moodId === 'all') next.delete('mood');
      else next.set('mood', moodId);
      return next;
    });
  };

  const resetAll = () => {
    setSelectedMood('all');
    setSelectedGenre('All');
    setSelectedEra('all');
    setMaxRuntime('all');
    setMinRating('all');
    setSortBy('rating-desc');
    setSearchParams({});
    setSurpriseMovie(null);
  };

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * MOVIES.length);
    const chosen = MOVIES[randomIndex];
    setSurpriseMovie(chosen);
    // Smooth scroll down to highlight
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Filter movies
  const filteredMovies = useMemo(() => {
    return MOVIES.filter((movie) => {
      // Mood filter
      if (selectedMood !== 'all') {
        const moodObj = MOODS.find(m => m.id === selectedMood);
        if (moodObj) {
          const hasMood = movie.moods?.some(m => m.toLowerCase().includes(moodObj.label.toLowerCase()) || moodObj.label.toLowerCase().includes(m.toLowerCase()));
          if (!hasMood) return false;
        }
      }

      // Genre filter
      if (selectedGenre !== 'All') {
        if (!movie.genres.includes(selectedGenre)) return false;
      }

      // Era filter
      if (selectedEra !== 'all') {
        if (selectedEra === '2020s' && movie.year < 2020) return false;
        if (selectedEra === '2010s' && (movie.year < 2010 || movie.year > 2019)) return false;
        if (selectedEra === 'classic' && movie.year >= 2010) return false;
      }

      // Runtime
      if (maxRuntime !== 'all') {
        if (maxRuntime === 'under-120' && movie.runtimeMinutes > 120) return false;
        if (maxRuntime === '120-150' && (movie.runtimeMinutes < 120 || movie.runtimeMinutes > 150)) return false;
        if (maxRuntime === 'over-150' && movie.runtimeMinutes < 150) return false;
      }

      // Rating
      if (minRating !== 'all') {
        const threshold = parseFloat(minRating);
        if (movie.rating < threshold) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating-desc') return b.rating - a.rating;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'runtime-desc') return b.runtimeMinutes - a.runtimeMinutes;
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [selectedMood, selectedGenre, selectedEra, maxRuntime, minRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-cine-border">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-1">
            Atmospheric & Genre Exploration
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cine-dark">
            Discover Cinema
          </h1>
          <p className="text-sm text-cine-muted mt-1 max-w-xl">
            Curate your viewing experience by emotional tone, running length, aesthetic era, and critical caliber.
          </p>
        </div>

        {/* Surprise Me / Random Roll */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSurpriseMe}
            className="px-4 py-2.5 rounded-md bg-cine-dark text-white text-xs font-semibold hover:bg-cine-accent transition-colors flex items-center gap-2 shadow-subtle"
          >
            <Dices className="w-4 h-4 text-cine-gold" />
            <span>Roll the Dice (Random Pick)</span>
          </button>
        </div>
      </div>

      {/* Surprise Me Highlight Card if triggered */}
      {surpriseMovie && (
        <div className="mb-10 p-6 rounded-xl bg-surface-muted border-2 border-cine-accent/40 shadow-card animate-fade-in relative">
          <button
            onClick={() => setSurpriseMovie(null)}
            className="absolute top-4 right-4 text-xs text-cine-muted hover:text-cine-dark underline"
          >
            Dismiss
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={surpriseMovie.poster}
              alt={surpriseMovie.title}
              className="w-28 aspect-[2/3] object-cover rounded shadow-md shrink-0"
            />
            <div>
              <span className="text-[11px] font-bold tracking-wider text-cine-accent uppercase">
                Curator's Random Selection
              </span>
              <h3 className="font-serif text-2xl font-bold text-cine-dark mt-1">
                {surpriseMovie.title} ({surpriseMovie.year})
              </h3>
              <p className="text-xs text-cine-body mt-2 leading-relaxed max-w-2xl">
                {surpriseMovie.overview}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => navigate(`/movie/${surpriseMovie.id}`)}
                  className="px-3.5 py-1.5 rounded bg-cine-dark text-white text-xs font-semibold hover:bg-cine-accent transition-colors"
                >
                  View Details & Trailer
                </button>
                <button
                  onClick={handleSurpriseMe}
                  className="text-xs text-cine-muted hover:text-cine-dark underline"
                >
                  Roll Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Selector Grid */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-3">
          Select Aesthetic Mood
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <button
            onClick={() => handleMoodSelect('all')}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedMood === 'all'
                ? 'bg-cine-dark text-white border-cine-dark font-semibold shadow-subtle'
                : 'bg-surface text-cine-body border-cine-border hover:bg-surface-muted'
            }`}
          >
            <div className="text-xs font-bold">All Moods</div>
            <div className={`text-[10px] mt-0.5 ${selectedMood === 'all' ? 'text-stone-300' : 'text-cine-muted'}`}>
              Full Spectrum
            </div>
          </button>

          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cine-accent text-white border-cine-accent font-semibold shadow-subtle'
                    : 'bg-surface text-cine-body border-cine-border hover:bg-surface-muted hover:border-cine-dark/30'
                }`}
              >
                <div className="text-xs font-bold leading-tight truncate">{mood.label}</div>
                <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-white/80' : 'text-cine-muted'}`}>
                  {mood.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Refined Filter Controls Bar */}
      <div className="mb-8 p-4 bg-surface rounded-lg border border-cine-border shadow-subtle grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Genre */}
        <div>
          <label className="block text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-canvas border border-cine-border rounded px-2.5 py-1.5 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
          >
            {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        {/* Era */}
        <div>
          <label className="block text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
            Decade / Era
          </label>
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="w-full bg-canvas border border-cine-border rounded px-2.5 py-1.5 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
          >
            {ERAS.map(era => <option key={era.id} value={era.id}>{era.label}</option>)}
          </select>
        </div>

        {/* Runtime */}
        <div>
          <label className="block text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
            Runtime
          </label>
          <select
            value={maxRuntime}
            onChange={(e) => setMaxRuntime(e.target.value)}
            className="w-full bg-canvas border border-cine-border rounded px-2.5 py-1.5 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
          >
            <option value="all">Any Length</option>
            <option value="under-120">Under 2 Hours (≤ 120m)</option>
            <option value="120-150">Standard (2h – 2h30m)</option>
            <option value="over-150">Epic (2h30m+)</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
            Rating
          </label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full bg-canvas border border-cine-border rounded px-2.5 py-1.5 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
          >
            <option value="all">Any Rating</option>
            <option value="8.5">⭐ 8.5+ Masterpiece</option>
            <option value="8.0">⭐ 8.0+ Acclaimed</option>
            <option value="7.5">⭐ 7.5+ Solid</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-canvas border border-cine-border rounded px-2.5 py-1.5 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
          >
            <option value="rating-desc">Highest Rated</option>
            <option value="year-desc">Newest Release</option>
            <option value="runtime-desc">Longest Runtime</option>
            <option value="title-asc">Title A-Z</option>
          </select>
        </div>

        {/* Reset */}
        <div className="flex items-end">
          <button
            onClick={resetAll}
            className="w-full py-1.5 rounded border border-cine-border bg-canvas hover:bg-surface-muted text-xs font-semibold text-cine-muted hover:text-cine-dark transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Discovery Results Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-cine-muted">
          Showing {filteredMovies.length} matching {filteredMovies.length === 1 ? 'title' : 'titles'}
        </span>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-surface rounded-xl border border-cine-border">
          <Film className="w-10 h-10 text-cine-muted mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-cine-dark mb-1">
            No matching films found
          </h3>
          <p className="text-xs text-cine-muted mb-4">
            Try adjusting your mood or length parameters to discover other gems.
          </p>
          <button
            onClick={resetAll}
            className="px-4 py-2 rounded bg-cine-dark text-white text-xs font-medium hover:bg-cine-accent transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
