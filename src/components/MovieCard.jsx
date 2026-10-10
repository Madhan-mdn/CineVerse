import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Bookmark, Heart, Film } from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { FALLBACK_POSTER } from '../api/tmdb';

export default function MovieCard({ movie, showGenre = true, className = "" }) {
  const { isInWatchlist, toggleWatchlist, isFavorite, toggleFavorite } = useMovieContext();
  
  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isFavorite(movie.id);

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const displayRating = typeof movie.rating === 'number' 
    ? movie.rating.toFixed(1) 
    : (movie.vote_average ? Number(movie.vote_average).toFixed(1) : '0.0');

  const displayYear = movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : (movie.release_date ? new Date(movie.release_date).getFullYear() : ''));

  const primaryGenre = Array.isArray(movie.genres) && movie.genres.length > 0
    ? (typeof movie.genres[0] === 'string' ? movie.genres[0] : movie.genres[0]?.name)
    : null;

  const posterSrc = movie.poster || movie.poster_path || FALLBACK_POSTER;

  return (
    <div className={`group relative flex flex-col bg-surface rounded-xl border border-surface-border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-cine-accent/40 ${className}`}>
      
      {/* 2:3 Aspect Ratio Movie Poster Container */}
      <Link to={`/movie/${movie.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900 block">
        <img
          src={posterSrc}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = FALLBACK_POSTER;
          }}
        />

        {/* Subtle dark gradient overlay at top & bottom for high contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-black/50 pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Action Buttons (Top Right: Favorite & Watchlist) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {/* Favorite Button */}
          <button
            type="button"
            onClick={handleFavoriteClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-subtle cursor-pointer ${
              inFavorites
                ? 'bg-rose-600 text-white opacity-100 scale-105'
                : 'bg-black/60 text-slate-300 hover:text-rose-500 hover:bg-black/90 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-xs'
            }`}
            title={inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
            aria-label={inFavorites ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${inFavorites ? 'fill-current' : ''}`} />
          </button>

          {/* Watchlist Button */}
          <button
            type="button"
            onClick={handleWatchlistClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-subtle cursor-pointer ${
              inWatchlist
                ? 'bg-cine-accent text-white opacity-100 scale-105'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-xs'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${inWatchlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Rating Badge on Poster (Bottom Left) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md border border-white/10 shadow-subtle">
          <Star className="w-3 h-3 fill-cine-gold text-cine-gold" />
          <span>{displayRating}</span>
        </div>
      </Link>

      {/* Card Body: Title, Year, Genre, View Details */}
      <div className="p-3.5 flex flex-col flex-grow justify-between bg-surface">
        <div>
          <Link to={`/movie/${movie.id}`}>
            <h3 className="font-semibold text-xs sm:text-sm text-cine-body line-clamp-1 group-hover:text-white transition-colors" title={movie.title}>
              {movie.title}
            </h3>
          </Link>
          
          <div className="flex items-center gap-1.5 text-[11px] text-cine-muted mt-1">
            {displayYear && <span className="font-medium text-slate-400">{displayYear}</span>}
            {displayYear && primaryGenre && <span>•</span>}
            {showGenre && primaryGenre && (
              <span className="truncate">{primaryGenre}</span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-surface-border flex items-center justify-between text-[11px]">
          <Link 
            to={`/movie/${movie.id}`}
            className="text-cine-muted hover:text-cine-accent font-semibold transition-colors flex items-center gap-1"
          >
            <span>View Details</span>
            <span>→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
