import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Award, 
  Calendar, 
  MapPin, 
  Film, 
  Star, 
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { ACTORS, getActorById } from '../data/actorsData';
import { getMovieById } from '../data/moviesData';
import MovieCard from '../components/MovieCard';

export default function ActorPage() {
  const { id } = useParams();
  const actor = getActorById(id) || ACTORS[0];

  const [filmographySort, setFilmographySort] = useState('year-desc');

  const knownForMovies = (actor.knownForMovieIds || [])
    .map(mid => getMovieById(mid))
    .filter(Boolean);

  const sortedFilmography = [...(actor.filmography || [])].sort((a, b) => {
    if (filmographySort === 'year-desc') return b.year - a.year;
    if (filmographySort === 'year-asc') return a.year - b.year;
    if (filmographySort === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Return Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="text-xs font-semibold text-cine-muted hover:text-cine-accent transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Theatrical Archive</span>
        </Link>
      </div>

      {/* Desktop & Tablet 2-Column Introduction */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start mb-14 pb-12 border-b border-cine-border">
        
        {/* Left Column (4 cols on lg, 5 on md): Headshot & Biographical Meta */}
        <div className="md:col-span-5 lg:col-span-4 space-y-6">
          <div className="aspect-[4/5] rounded-xl overflow-hidden border border-cine-border shadow-card bg-surface-muted max-w-[340px] mx-auto lg:max-w-none">
            <img
              src={actor.photo}
              alt={actor.name}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {/* Biographical Data Card */}
          <div className="p-5 bg-surface rounded-xl border border-cine-border space-y-3.5 text-xs shadow-subtle max-w-[340px] mx-auto lg:max-w-none">
            <h3 className="font-serif font-bold text-sm text-cine-dark uppercase tracking-wider pb-2 border-b border-cine-border">
              Archival Dossier
            </h3>

            {actor.birthDate && (
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-cine-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-cine-muted font-bold block">Born</span>
                  <span className="text-cine-dark font-medium">{actor.birthDate}</span>
                </div>
              </div>
            )}

            {actor.birthPlace && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cine-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-cine-muted font-bold block">Birthplace</span>
                  <span className="text-cine-dark font-medium">{actor.birthPlace}</span>
                </div>
              </div>
            )}

            {actor.activeYears && (
              <div className="flex items-start gap-2.5">
                <Film className="w-4 h-4 text-cine-muted shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase text-cine-muted font-bold block">Active Career</span>
                  <span className="text-cine-dark font-medium">{actor.activeYears}</span>
                </div>
              </div>
            )}

            {actor.awards && actor.awards.length > 0 && (
              <div className="pt-2 border-t border-cine-border">
                <span className="text-[10px] uppercase text-cine-muted font-bold block mb-1.5">
                  Major Accolades
                </span>
                <ul className="space-y-1">
                  {actor.awards.map((award, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-cine-body">
                      <Award className="w-3.5 h-3.5 text-cine-gold shrink-0 mt-0.5" />
                      <span className="leading-tight">{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (8 cols on lg, 7 on md): Biography & Known-For Showcase */}
        <div className="md:col-span-7 lg:col-span-8 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cine-accent block mb-1">
              {actor.role}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cine-dark mb-4">
              {actor.name}
            </h1>

            <div className="prose prose-stone text-sm sm:text-base leading-relaxed text-cine-body font-normal space-y-3">
              <p>{actor.biography}</p>
            </div>
          </div>

          {/* Known For Marquee */}
          {knownForMovies.length > 0 && (
            <div>
              <h2 className="font-serif text-xl font-bold text-cine-dark mb-4">
                Notable CineVerse Engagements
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {knownForMovies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Complete Filmography Table */}
      <div className="bg-surface rounded-xl border border-cine-border p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-cine-border">
          <div>
            <h3 className="font-serif text-xl font-bold text-cine-dark">
              Full Career Filmography
            </h3>
            <p className="text-xs text-cine-muted mt-0.5">
              Chronological body of work and performance catalog
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-cine-muted font-medium">Sort:</span>
            <select
              value={filmographySort}
              onChange={(e) => setFilmographySort(e.target.value)}
              className="bg-canvas border border-cine-border rounded px-2.5 py-1 text-xs text-cine-dark focus:outline-none focus:border-cine-accent"
            >
              <option value="year-desc">Year (Newest)</option>
              <option value="year-asc">Year (Oldest)</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="title-asc">Title A-Z</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-cine-border text-xs sm:text-sm">
          {sortedFilmography.map((item, idx) => (
            <div
              key={idx}
              className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-surface-muted/50 transition-colors rounded"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <span className="font-semibold text-cine-muted w-10 sm:w-12 shrink-0 pt-0.5 sm:pt-0">{item.year}</span>
                <div>
                  {item.movieId ? (
                    <Link
                      to={`/movie/${item.movieId}`}
                      className="font-bold text-cine-dark hover:text-cine-accent transition-colors"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <span className="font-bold text-cine-dark">{item.title}</span>
                  )}
                  <span className="text-xs text-cine-muted block sm:inline sm:ml-2">as {item.role}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 pl-[52px] sm:pl-0">
                {item.rating && (
                  <div className="flex items-center gap-1 font-bold text-cine-gold">
                    <Star className="w-3.5 h-3.5 fill-cine-gold" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                )}
                {item.movieId && (
                  <Link
                    to={`/movie/${item.movieId}`}
                    className="text-xs font-semibold text-cine-accent hover:underline flex items-center gap-0.5"
                  >
                    <span>View Film</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
