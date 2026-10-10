import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Check, Plus, Star, Film, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import TrailerModal from './TrailerModal';

export default function Hero({ featuredMovies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const { isInWatchlist, toggleWatchlist, isFavorite, toggleFavorite } = useMovieContext();

  if (!featuredMovies || !featuredMovies.length) return null;

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];
  const inList = isInWatchlist(currentMovie.id);
  const fav = isFavorite(currentMovie.id);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const trailerId = currentMovie.trailerYoutubeId || currentMovie.trailerId || currentMovie.trailerKey || '';

  return (
    <div className="relative mb-12 sm:mb-16">
      {/* Main Hero Card Container */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-0 md:min-h-[440px] lg:min-h-[500px]">
          
          {/* Movie Information (Left column on md+) */}
          <div className="md:col-span-6 lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between order-2 md:order-1 bg-gradient-to-br from-surface to-surface-muted/90">
            <div>
              {/* Badge & Slide Indicators */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cine-accent text-white text-[11px] font-bold uppercase tracking-wider shadow-subtle">
                  <Film className="w-3.5 h-3.5" />
                  Featured Spotlight
                </span>

                {featuredMovies.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    {featuredMovies.map((m, idx) => (
                      <button
                        key={m.id || idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === currentIndex ? 'w-6 bg-cine-accent' : 'w-2 bg-slate-700 hover:bg-slate-500'
                        }`}
                        title={m.title}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight mb-3">
                <Link to={`/movie/${currentMovie.id}`} className="hover:text-cine-accent transition-colors">
                  {currentMovie.title}
                </Link>
              </h1>

              {/* Metadata Bar */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-cine-muted mb-4 font-medium">
                {currentMovie.year && <span className="font-semibold text-white">{currentMovie.year}</span>}
                {currentMovie.runtime && (
                  <>
                    <span>•</span>
                    <span>{typeof currentMovie.runtime === 'number' ? `${currentMovie.runtime} min` : currentMovie.runtime}</span>
                  </>
                )}
                {Array.isArray(currentMovie.genres) && currentMovie.genres.length > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-slate-300">
                      {currentMovie.genres.slice(0, 2).map(g => (typeof g === 'object' ? g.name : g)).join(' / ')}
                    </span>
                  </>
                )}
                {typeof currentMovie.rating === 'number' && currentMovie.rating > 0 && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 font-bold text-cine-gold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Star className="w-3 h-3 fill-cine-gold text-cine-gold" />
                      {currentMovie.rating.toFixed(1)}
                    </span>
                  </>
                )}
              </div>

              {/* Tagline */}
              {currentMovie.tagline && (
                <p className="text-xs italic font-serif text-slate-400 mb-3 border-l-2 border-cine-accent pl-2.5">
                  "{currentMovie.tagline}"
                </p>
              )}

              {/* Overview */}
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal mb-6 line-clamp-3 md:line-clamp-4 lg:line-clamp-5">
                {currentMovie.overview}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-4 border-t border-surface-border">
              {trailerId && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  className="px-4 py-2 sm:py-2.5 rounded-lg bg-cine-accent text-white font-semibold text-xs sm:text-sm hover:bg-cine-accent-hover transition-colors flex items-center gap-2 shadow-subtle cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={() => toggleWatchlist(currentMovie)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 border cursor-pointer ${
                  inList
                    ? 'bg-surface-subtle text-white border-slate-600'
                    : 'bg-surface text-slate-300 border-surface-border hover:bg-surface-muted hover:text-white'
                }`}
              >
                {inList ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-cine-accent" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleFavorite(currentMovie)}
                className={`p-2 sm:p-2.5 rounded-lg border transition-colors cursor-pointer ${
                  fav
                    ? 'bg-rose-950/60 text-rose-500 border-rose-800'
                    : 'bg-surface text-slate-400 border-surface-border hover:text-rose-500 hover:bg-surface-muted'
                }`}
                title={fav ? 'Remove from Favorites' : 'Add to Favorites'}
                aria-label={fav ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Heart className={`w-4 h-4 ${fav ? 'fill-current text-rose-500' : ''}`} />
              </button>

              <Link
                to={`/movie/${currentMovie.id}`}
                className="ml-auto text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Large Movie Artwork (Right column on md+) */}
          <div className="md:col-span-6 lg:col-span-7 relative min-h-[240px] sm:min-h-[300px] md:min-h-full order-1 md:order-2 overflow-hidden bg-black">
            <img
              src={currentMovie.backdrop || currentMovie.poster}
              alt={currentMovie.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Gradient overlays */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-surface via-transparent to-black/30 pointer-events-none" />
            <div className="md:hidden absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent pointer-events-none" />

            {/* Quick Trailer Play Button overlay */}
            {trailerId && (
              <button
                onClick={() => setTrailerOpen(true)}
                className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 hover:bg-cine-accent transition-all shadow-2xl cursor-pointer group"
                title="Play Trailer"
                aria-label="Play Trailer"
              >
                <Play className="w-6 h-6 fill-white text-white ml-0.5" />
              </button>
            )}

            {/* Prev/Next arrows for switcher */}
            {featuredMovies.length > 1 && (
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5 z-10">
                <button
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                  aria-label="Previous movie"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
                  aria-label="Next movie"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Trailer Modal */}
      {trailerId && (
        <TrailerModal
          isOpen={trailerOpen}
          onClose={() => setTrailerOpen(false)}
          youtubeId={trailerId}
          title={currentMovie.title}
        />
      )}
    </div>
  );
}
