import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  CheckCircle2, 
  Play, 
  Plus, 
  Check, 
  RotateCcw,
  Sliders,
  ArrowRight,
  Film
} from 'lucide-react';
import { MOVIES } from '../data/moviesData';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

const LANGUAGES = [
  'All Languages',
  'English',
  'Hindi',
  'Telugu',
  'Tamil',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi',
  'Punjabi',
  'Gujarati',
  'Korean',
  'Japanese',
  'Spanish',
  'French'
];

const GENRES_LIST = [
  'All Genres',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Mystery'
];

const YEARS = [
  'Any Year',
  '2026',
  '2025',
  '2020–2024',
  '2010–2019',
  'Before 2010'
];

const RATINGS = [
  'Any Rating',
  '8+',
  '7+',
  '6+',
  '5+'
];

const SORTS = [
  'Recommended',
  'Rating',
  'Newest',
  'Most Popular'
];

export default function RecommendationsPage() {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  // Exactly 5 filter parameters
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedYear, setSelectedYear] = useState('Any Year');
  const [selectedRating, setSelectedRating] = useState('Any Rating');
  const [selectedSort, setSelectedSort] = useState('Recommended');

  // Reset Filters action
  const handleResetFilters = () => {
    setSelectedLanguage('All Languages');
    setSelectedGenre('All Genres');
    setSelectedYear('Any Year');
    setSelectedRating('Any Rating');
    setSelectedSort('Recommended');
  };

  const hasActiveFilters = 
    selectedLanguage !== 'All Languages' ||
    selectedGenre !== 'All Genres' ||
    selectedYear !== 'Any Year' ||
    selectedRating !== 'Any Rating' ||
    selectedSort !== 'Recommended';

  // Compute filtered and sorted recommendations
  const filteredAndSortedMovies = useMemo(() => {
    const list = MOVIES.filter((movie) => {
      // Filter 1 — Language
      if (selectedLanguage !== 'All Languages') {
        if (!movie.language || !movie.language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
          return false;
        }
      }

      // Filter 2 — Genre
      if (selectedGenre !== 'All Genres') {
        if (!movie.genres || !movie.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())) {
          return false;
        }
      }

      // Filter 3 — Release Year
      if (selectedYear === '2026') {
        if (movie.year !== 2026) return false;
      } else if (selectedYear === '2025') {
        if (movie.year !== 2025) return false;
      } else if (selectedYear === '2020–2024' || selectedYear === '2020-2024') {
        if (movie.year < 2020 || movie.year > 2024) return false;
      } else if (selectedYear === '2010–2019' || selectedYear === '2010-2019') {
        if (movie.year < 2010 || movie.year > 2019) return false;
      } else if (selectedYear === 'Before 2010') {
        if (movie.year >= 2010) return false;
      }

      // Filter 4 — Rating
      if (selectedRating === '8+') {
        if (movie.rating < 8.0) return false;
      } else if (selectedRating === '7+') {
        if (movie.rating < 7.0) return false;
      } else if (selectedRating === '6+') {
        if (movie.rating < 6.0) return false;
      } else if (selectedRating === '5+') {
        if (movie.rating < 5.0) return false;
      }

      return true;
    });

    // Filter 5 — Sort By
    if (selectedSort === 'Rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (selectedSort === 'Newest') {
      list.sort((a, b) => (b.year - a.year) || (b.rating - a.rating));
    } else if (selectedSort === 'Most Popular') {
      list.sort((a, b) => {
        const popA = (a.audienceScore || 85) * 0.5 + (a.rottenTomatoes || 85) * 0.3 + a.rating * 5;
        const popB = (b.audienceScore || 85) * 0.5 + (b.rottenTomatoes || 85) * 0.3 + b.rating * 5;
        return popB - popA;
      });
    } else {
      // 'Recommended' (Default deterministic ranking)
      list.sort((a, b) => {
        const scoreA = a.rating * 10 + (a.metascore || 80) * 0.2 + (a.audienceScore || 85) * 0.2;
        const scoreB = b.rating * 10 + (b.metascore || 80) * 0.2 + (b.audienceScore || 85) * 0.2;
        return scoreB - scoreA;
      });
    }

    return list;
  }, [selectedLanguage, selectedGenre, selectedYear, selectedRating, selectedSort]);

  const bestMatch = filteredAndSortedMovies[0] || null;
  const alternativeMatches = filteredAndSortedMovies.slice(1);
  const inList = bestMatch ? isInWatchlist(bestMatch.id) : false;

  // Generate dynamic reasons why top match fits
  const matchReasons = useMemo(() => {
    if (!bestMatch) return [];
    const reasons = [];
    if (selectedLanguage !== 'All Languages') {
      reasons.push(`Presented in ${bestMatch.language} conforming to your active language selection`);
    } else {
      reasons.push(`Acclaimed landmark work from ${bestMatch.country} (${bestMatch.language})`);
    }

    if (selectedGenre !== 'All Genres') {
      reasons.push(`Classified within your chosen genre: ${selectedGenre}`);
    } else {
      reasons.push(`Hallmark genre balance: ${bestMatch.genres.join(', ')}`);
    }

    if (selectedYear !== 'Any Year') {
      reasons.push(`Released in ${bestMatch.year} matching your era filter`);
    } else {
      reasons.push(`Exhibition epoch: ${bestMatch.year}`);
    }

    if (selectedRating !== 'Any Rating') {
      reasons.push(`Exceeds your ${selectedRating} caliber threshold with an elite score of ${bestMatch.rating.toFixed(1)}/10`);
    } else {
      reasons.push(`Holds a stellar verified critical rating of ${bestMatch.rating.toFixed(1)}/10`);
    }

    return reasons;
  }, [bestMatch, selectedLanguage, selectedGenre, selectedYear, selectedRating]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title & Subtitle */}
      <div className="mb-8 pb-6 border-b border-cine-border">
        <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-1">
          Tailored Film Curation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cine-dark">
          What Should I Watch?
        </h1>
        <p className="text-sm text-cine-muted mt-1 max-w-xl">
          Discover your next cinematic experience across world and Indian cinema. Refine your preferences using our 5 core taste parameters.
        </p>
      </div>

      {/* Interactive 5-Parameter Filter Bar */}
      <div className="mb-10 p-5 sm:p-6 bg-surface rounded-xl border border-cine-border shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-cine-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cine-accent" />
            <h2 className="font-serif text-base font-bold text-cine-dark">
              Filter Parameters
            </h2>
            <span className="text-[11px] bg-surface-muted px-2 py-0.5 rounded text-cine-muted font-semibold hidden sm:inline">
              {filteredAndSortedMovies.length} {filteredAndSortedMovies.length === 1 ? 'film' : 'films'} found
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-cine-accent hover:text-cine-dark flex items-center gap-1.5 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Responsive Grid for the 5 Filter Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* 1. Language */}
          <div>
            <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
              1. Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark font-medium focus:outline-none focus:border-cine-accent transition-colors"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* 2. Genre */}
          <div>
            <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
              2. Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark font-medium focus:outline-none focus:border-cine-accent transition-colors"
            >
              {GENRES_LIST.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* 3. Release Year */}
          <div>
            <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
              3. Release Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark font-medium focus:outline-none focus:border-cine-accent transition-colors"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* 4. Rating */}
          <div>
            <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
              4. Rating
            </label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark font-medium focus:outline-none focus:border-cine-accent transition-colors"
            >
              {RATINGS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* 5. Sort By */}
          <div>
            <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
              5. Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full bg-canvas border border-cine-border rounded-md px-3 py-2 text-xs text-cine-dark font-medium focus:outline-none focus:border-cine-accent transition-colors"
            >
              {SORTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Zero Results Empty State */}
      {filteredAndSortedMovies.length === 0 && (
        <div className="py-16 px-6 text-center bg-surface rounded-xl border border-cine-border shadow-subtle my-8 animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-surface-muted border border-cine-border flex items-center justify-center mx-auto mb-4 text-cine-muted">
            <Film className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-cine-dark mb-2">
            No movies found matching these filters
          </h3>
          <p className="text-xs sm:text-sm text-cine-muted max-w-md mx-auto mb-6">
            We couldn't find any films matching your exact combination of preferences. Try adjusting your filter parameters or resetting all filters.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cine-dark text-white text-xs font-semibold hover:bg-cine-accent transition-colors shadow-subtle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* Top Match Result Featured Hero Card */}
      {bestMatch && (
        <section className="mb-14 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cine-accent">
                Top Recommendation
              </span>
              <span className="text-xs text-cine-muted">•</span>
              <span className="text-xs font-bold text-cine-dark">
                {bestMatch.language} Cinema
              </span>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-cine-border shadow-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
              
              {/* Left Column (5 cols): Poster + Image */}
              <div className="md:col-span-5 relative min-h-[280px] md:min-h-full bg-black overflow-hidden">
                <img
                  src={bestMatch.backdrop || bestMatch.poster}
                  alt={bestMatch.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="bg-cine-accent text-white font-bold text-xs px-2.5 py-1 rounded shadow">
                    Top Pick
                  </span>
                  <span className="bg-black/75 backdrop-blur-xs text-white font-bold text-xs px-2.5 py-1 rounded flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-cine-gold text-cine-gold" />
                    <span>{bestMatch.rating.toFixed(1)}</span>
                  </span>
                </div>
              </div>

              {/* Right Column (7 cols): Information & Match Analysis */}
              <div className="md:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-cine-muted mb-2 font-medium">
                    <span>{bestMatch.year}</span>
                    <span>•</span>
                    <span>{bestMatch.runtime}</span>
                    <span>•</span>
                    <span className="font-semibold text-cine-dark">{bestMatch.language}</span>
                    <span>•</span>
                    <span>{bestMatch.genres.join(', ')}</span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-cine-dark mb-2">
                    <Link to={`/movie/${bestMatch.id}`} className="hover:text-cine-accent transition-colors">
                      {bestMatch.title}
                    </Link>
                  </h2>

                  {bestMatch.tagline && (
                    <p className="font-serif italic text-xs sm:text-sm text-cine-muted mb-4">
                      "{bestMatch.tagline}"
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-cine-body leading-relaxed mb-6 font-normal">
                    {bestMatch.overview}
                  </p>

                  {/* Why it matches breakdown box */}
                  <div className="p-4 rounded-lg bg-surface-muted border border-cine-border mb-6">
                    <h4 className="text-xs uppercase font-bold text-cine-dark tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cine-accent" />
                      <span>Why This Fits Your Selection</span>
                    </h4>

                    <ul className="space-y-1.5 text-xs text-cine-body">
                      {matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-cine-accent font-bold">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-cine-border">
                  {bestMatch.trailerYoutubeId && (
                    <button
                      type="button"
                      onClick={() => setTrailerModalOpen(true)}
                      className="px-4 py-2 rounded bg-cine-dark text-white font-medium text-xs hover:bg-cine-accent transition-colors flex items-center gap-1.5 shadow-subtle"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Watch Trailer</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleWatchlist(bestMatch.id)}
                    className={`px-4 py-2 rounded font-medium text-xs transition-colors flex items-center gap-1.5 border ${
                      inList
                        ? 'bg-cine-accent-light text-cine-accent border-cine-accent/40 font-semibold'
                        : 'bg-surface text-cine-dark border-cine-border hover:bg-surface-muted'
                    }`}
                  >
                    {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{inList ? 'In Watchlist' : 'Add to Watchlist'}</span>
                  </button>

                  <Link
                    to={`/movie/${bestMatch.id}`}
                    className="w-full sm:w-auto sm:ml-auto text-xs font-semibold text-cine-dark hover:text-cine-accent transition-colors flex items-center justify-end sm:justify-start gap-1 pt-1 sm:pt-0"
                  >
                    <span>Full Film Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* Alternative Recommendations Shelf */}
      {alternativeMatches.length > 0 && (
        <section className="pt-6 border-t border-cine-border animate-fade-in">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h3 className="font-serif text-2xl font-bold text-cine-dark">
                More Matching Titles
              </h3>
              <p className="text-xs sm:text-sm text-cine-muted mt-0.5">
                Additional films meeting your current selection criteria
              </p>
            </div>
            <span className="text-xs font-semibold text-cine-muted">
              {alternativeMatches.length} {alternativeMatches.length === 1 ? 'additional film' : 'additional films'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {alternativeMatches.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* Single match note */}
      {bestMatch && alternativeMatches.length === 0 && (
        <div className="pt-4 text-center text-xs text-cine-muted">
          Showing the single curated film matching all 5 selected criteria.
        </div>
      )}

      {/* Trailer Modal */}
      {bestMatch && bestMatch.trailerYoutubeId && (
        <TrailerModal
          isOpen={trailerModalOpen}
          onClose={() => setTrailerModalOpen(false)}
          youtubeId={bestMatch.trailerYoutubeId}
          title={bestMatch.title}
        />
      )}

    </div>
  );
}
