import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function MovieShelf({
  title,
  subtitle,
  movies = [],
  viewAllLink,
  className = ""
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || !movies.length) return null;

  return (
    <section className={`mb-10 sm:mb-14 max-w-full overflow-hidden ${className}`}>
      {/* Shelf Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-5">
        <div>
          {title && (
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-cine-muted mt-0.5 sm:mt-1 font-normal line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-xs font-semibold text-slate-300 hover:text-cine-accent transition-colors flex items-center gap-1 group"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Scroll arrow buttons for tablet and desktop */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-lg border border-surface-border bg-surface text-slate-300 hover:text-white hover:border-slate-500 flex items-center justify-center transition-colors shadow-subtle cursor-pointer"
              aria-label={`Scroll ${title || 'movies'} left`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-lg border border-surface-border bg-surface text-slate-300 hover:text-white hover:border-slate-500 flex items-center justify-center transition-colors shadow-subtle cursor-pointer"
              aria-label={`Scroll ${title || 'movies'} right`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Movie Cards Track */}
      <div
        ref={scrollRef}
        className="flex gap-3.5 sm:gap-4 lg:gap-5 overflow-x-auto pb-4 pt-1 px-0.5 no-scrollbar custom-scrollbar snap-x snap-mandatory"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[155px] sm:w-[185px] md:w-[200px] lg:w-[215px] shrink-0 snap-start"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
