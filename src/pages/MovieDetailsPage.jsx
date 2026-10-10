import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Calendar, 
  Bookmark, 
  Heart, 
  Check, 
  Play, 
  Share2, 
  ArrowLeft,
  Film,
  Globe,
  DollarSign
} from 'lucide-react';
import { getMovieDetails, FALLBACK_POSTER } from '../api/tmdb';
import { useMovieContext } from '../context/MovieContext';
import MovieShelf from '../components/MovieShelf';
import TrailerModal from '../components/TrailerModal';
import EmptyState from '../components/EmptyState';
import { MovieDetailsSkeleton } from '../components/LoadingSkeleton';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist, isFavorite, toggleFavorite } = useMovieContext();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchDetails() {
      setLoading(true);
      try {
        const data = await getMovieDetails(id);
        if (isMounted) {
          setMovie(data);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err);
        if (isMounted) setMovie(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <MovieDetailsSkeleton />;
  }

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Movie Not Found"
          description="We couldn't locate the details for this movie. It may have been removed or the ID is incorrect."
          actionText="Back to Explore Movies"
          onAction={() => navigate('/explore')}
        />
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const inFavorites = isFavorite(movie.id);

  const trailerId = movie.trailerId || movie.trailerYoutubeId || movie.trailerKey || '';
  const similarList = movie.similar || [];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const posterSrc = movie.poster || movie.poster_path || FALLBACK_POSTER;

  return (
    <div className="min-h-screen pb-16">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between text-xs text-cine-muted">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-white font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg border border-surface-border bg-surface hover:bg-surface-muted text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share Link"
          >
            <Share2 className="w-3 h-3" />
            <span>{copiedLink ? 'Copied Link!' : 'Share Film'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner / Backdrop Image */}
      {movie.backdrop && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 mb-8">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.4/1] w-full rounded-2xl overflow-hidden border border-surface-border shadow-card bg-black">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-black/40 to-transparent" />
            
            {trailerId && (
              <button
                onClick={() => setTrailerModalOpen(true)}
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 px-4 py-2 rounded-xl bg-cine-accent hover:bg-cine-accent-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-card cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Trailer</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Movie Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Poster + Actions + Metadata */}
          <div className="md:col-span-5 lg:col-span-4 space-y-6">
            
            {/* Poster */}
            <div className="relative aspect-[2/3] w-full max-w-[320px] mx-auto md:max-w-none rounded-2xl overflow-hidden border border-surface-border shadow-card bg-slate-900">
              <img
                src={posterSrc}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_POSTER;
                }}
              />
            </div>

            {/* Action Buttons: Add to Watchlist & Add to Favorites */}
            <div className="space-y-3">
              <button
                onClick={() => toggleWatchlist(movie)}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border shadow-subtle cursor-pointer ${
                  inWatchlist
                    ? 'bg-surface-subtle text-white border-slate-600'
                    : 'bg-surface hover:bg-surface-muted text-white border-surface-border'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${inWatchlist ? 'fill-cine-accent text-cine-accent' : ''}`} />
                <span>{inWatchlist ? 'In Your Watchlist' : 'Add to Watchlist'}</span>
              </button>

              <button
                onClick={() => toggleFavorite(movie)}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border shadow-subtle cursor-pointer ${
                  inFavorites
                    ? 'bg-rose-900/60 text-white border-rose-700'
                    : 'bg-surface hover:bg-surface-muted text-white border-surface-border'
                }`}
              >
                <Heart className={`w-4 h-4 ${inFavorites ? 'fill-current text-rose-500' : ''}`} />
                <span>{inFavorites ? 'In Your Favorites' : 'Add to Favorites'}</span>
              </button>

              {trailerId && (
                <button
                  onClick={() => setTrailerModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-cine-accent hover:bg-cine-accent-hover text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-subtle"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Trailer</span>
                </button>
              )}
            </div>

            {/* Quick Metadata Box */}
            <div className="bg-surface rounded-xl border border-surface-border p-5 space-y-3.5 text-xs shadow-card">
              <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] border-b border-surface-border pb-2.5">
                Film Information
              </h3>

              {movie.releaseDate && (
                <div className="flex items-center justify-between">
                  <span className="text-cine-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Release Date
                  </span>
                  <span className="font-semibold text-white">
                    {movie.releaseDate}
                  </span>
                </div>
              )}

              {movie.runtime && (
                <div className="flex items-center justify-between">
                  <span className="text-cine-muted flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Runtime
                  </span>
                  <span className="font-semibold text-white">
                    {movie.runtime}
                  </span>
                </div>
              )}

              {/* Discreet display of original language */}
              {movie.originalLanguage && (
                <div className="flex items-center justify-between">
                  <span className="text-cine-muted flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    Original Language
                  </span>
                  <span className="font-semibold text-white uppercase">
                    {movie.originalLanguage}
                  </span>
                </div>
              )}

              {typeof movie.rating === 'number' && movie.rating > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-cine-muted flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-cine-gold" />
                    Rating
                  </span>
                  <span className="font-bold text-white">
                    ★ {movie.rating.toFixed(1)} / 10
                    {movie.voteCount ? ` (${movie.voteCount.toLocaleString()} votes)` : ''}
                  </span>
                </div>
              )}

              {movie.budget && (
                <div className="flex items-center justify-between">
                  <span className="text-cine-muted flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Budget
                  </span>
                  <span className="font-semibold text-white">{movie.budget}</span>
                </div>
              )}

              {movie.revenue && (
                <div className="flex items-center justify-between">
                  <span className="text-cine-muted flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    Revenue
                  </span>
                  <span className="font-semibold text-white">{movie.revenue}</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Title, Overview, Cast, Director */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8">
            
            {/* Header Titles & Tags */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {movie.year && (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-surface border border-surface-border text-slate-300">
                    {movie.year}
                  </span>
                )}
                {typeof movie.rating === 'number' && movie.rating > 0 && (
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-cine-gold border border-amber-500/20 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-cine-gold" />
                    {movie.rating.toFixed(1)} Rating
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-2">
                {movie.title}
              </h1>

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <h2 className="text-sm sm:text-base text-slate-400 italic mb-3">
                  Original Title: {movie.originalTitle}
                </h2>
              )}

              {movie.tagline && (
                <p className="text-sm sm:text-base italic font-serif text-slate-300 mb-4 border-l-2 border-cine-accent pl-3">
                  "{movie.tagline}"
                </p>
              )}

              {/* Genre Badges (linking to Explore by genre) */}
              {Array.isArray(movie.genres) && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map((genre) => {
                    const genreName = typeof genre === 'string' ? genre : genre.name;
                    return (
                      <Link
                        key={genreName}
                        to={`/explore?genre=${encodeURIComponent(genreName)}`}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-surface border border-surface-border hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
                      >
                        {genreName}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Story Summary / Overview */}
            <div className="bg-surface rounded-xl border border-surface-border p-6 shadow-card">
              <h2 className="font-serif text-lg font-bold text-white mb-3">
                Overview
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-normal">
                {movie.overview || 'No overview available for this movie.'}
              </p>
            </div>

            {/* Director Information */}
            {movie.director && (
              <div className="bg-surface rounded-xl border border-surface-border p-6 shadow-card">
                <h2 className="font-serif text-lg font-bold text-white mb-3">
                  Director
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cine-accent text-white flex items-center justify-center font-bold text-sm shadow-subtle">
                    {movie.director.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{movie.director}</h3>
                    <p className="text-xs text-slate-400">Director</p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Cast */}
            {Array.isArray(movie.cast) && movie.cast.length > 0 && (
              <div className="bg-surface rounded-xl border border-surface-border p-6 shadow-card">
                <h2 className="font-serif text-lg font-bold text-white mb-4">
                  Top Cast
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {movie.cast.slice(0, 8).map((actor, idx) => (
                    <div key={actor.id || idx} className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-800 border border-surface-border">
                        {actor.photo ? (
                          <img
                            src={actor.photo}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                            {actor.name?.charAt(0) || 'A'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">
                          {actor.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {actor.role || 'Actor'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Similar Movies Shelf */}
        {similarList.length > 0 && (
          <div className="mt-16 pt-12 border-t border-surface-border">
            <MovieShelf
              title="Similar Movies"
              subtitle="Titles sharing similar genres, themes, and audience recommendations"
              movies={similarList}
              viewAllLink="/explore"
            />
          </div>
        )}

      </div>

      {/* Trailer Video Modal */}
      {trailerId && (
        <TrailerModal
          isOpen={trailerModalOpen}
          onClose={() => setTrailerModalOpen(false)}
          youtubeId={trailerId}
          title={movie.title}
        />
      )}

    </div>
  );
}
