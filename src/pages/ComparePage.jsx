import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Star, 
  Clock, 
  Calendar, 
  Film, 
  Award, 
  ArrowLeftRight, 
  Check, 
  Sparkles,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { MOVIES, getMovieById } from '../data/moviesData';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const m1Param = searchParams.get('m1') || 'dune-part-two';
  const m2Param = searchParams.get('m2') || 'interstellar';

  const [movie1Id, setMovie1Id] = useState(m1Param);
  const [movie2Id, setMovie2Id] = useState(m2Param);

  useEffect(() => {
    if (m1Param) setMovie1Id(m1Param);
    if (m2Param) setMovie2Id(m2Param);
  }, [m1Param, m2Param]);

  const handleMovie1Change = (id) => {
    setMovie1Id(id);
    setSearchParams({ m1: id, m2: movie2Id });
  };

  const handleMovie2Change = (id) => {
    setMovie2Id(id);
    setSearchParams({ m1: movie1Id, m2: id });
  };

  const movie1 = getMovieById(movie1Id) || MOVIES[0];
  const movie2 = getMovieById(movie2Id) || MOVIES[1];

  // Radar / attribute metrics comparison
  const attributes = [
    { key: 'visuals', label: 'Visual Spectacle & Scale' },
    { key: 'score', label: 'Musical Score & Sound Design' },
    { key: 'pacing', label: 'Narrative Pacing & Momentum' },
    { key: 'writing', label: 'Screenplay & Thematic Depth' },
    { key: 'cast', label: 'Ensemble Performance Caliber' },
    { key: 'emotionalImpact', label: 'Emotional Resonance' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-cine-border">
        <div>
          <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-1">
            Head-to-Head Theatrical Analysis
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cine-dark">
            Film Comparison
          </h1>
          <p className="text-xs sm:text-sm text-cine-muted mt-1">
            Side-by-side critical evaluation, technical specifications, and stylistic consensus.
          </p>
        </div>

        {/* Quick swap button */}
        <button
          onClick={() => {
            const temp = movie1Id;
            setMovie1Id(movie2Id);
            setMovie2Id(temp);
            setSearchParams({ m1: movie2Id, m2: temp });
          }}
          className="px-3.5 py-2 rounded-md border border-cine-border bg-surface hover:bg-surface-muted text-xs font-semibold text-cine-dark flex items-center gap-2 self-start md:self-auto transition-colors shadow-subtle"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Swap Positions</span>
        </button>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-4 bg-surface rounded-lg border border-cine-border shadow-subtle">
        <div>
          <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
            Film 1 (Primary)
          </label>
          <select
            value={movie1Id}
            onChange={(e) => handleMovie1Change(e.target.value)}
            className="w-full bg-canvas border border-cine-border rounded px-3 py-2 text-xs font-semibold text-cine-dark focus:outline-none focus:border-cine-accent"
          >
            {MOVIES.map(m => (
              <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1.5">
            Film 2 (Contender)
          </label>
          <select
            value={movie2Id}
            onChange={(e) => handleMovie2Change(e.target.value)}
            className="w-full bg-canvas border border-cine-border rounded px-3 py-2 text-xs font-semibold text-cine-dark focus:outline-none focus:border-cine-accent"
          >
            {MOVIES.map(m => (
              <option key={m.id} value={m.id}>{m.title} ({m.year})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Dual Poster & Overview Marquee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 mb-12 relative">
        
        {/* Movie 1 Card */}
        <div className="bg-surface rounded-xl border border-cine-border p-4 sm:p-6 shadow-card flex flex-col justify-between">
          <div className="flex gap-3.5 sm:gap-5">
            <img
              src={movie1.poster}
              alt={movie1.title}
              className="w-24 sm:w-32 aspect-[2/3] object-cover rounded-md border border-cine-border shadow-md shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-cine-accent uppercase tracking-wider block truncate">
                {movie1.genres.slice(0, 2).join(' / ')}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-cine-dark mt-1 truncate">
                <Link to={`/movie/${movie1.id}`} className="hover:text-cine-accent transition-colors">
                  {movie1.title}
                </Link>
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-cine-muted mt-1 font-medium">
                <span>{movie1.year}</span>
                <span>•</span>
                <span>{movie1.runtime}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-bold text-cine-gold">
                  <Star className="w-3 h-3 fill-cine-gold" />
                  {movie1.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-cine-body mt-2.5 line-clamp-3 leading-relaxed">
                {movie1.overview}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-5 pt-3 border-t border-cine-border text-[11px] sm:text-xs flex flex-wrap justify-between items-center gap-1 text-cine-muted">
            <span>Director: <strong className="text-cine-dark">{movie1.director}</strong></span>
            <span>Composer: <strong className="text-cine-dark">{movie1.composer}</strong></span>
          </div>
        </div>

        {/* Mobile VS Badge Divider */}
        <div className="flex md:hidden items-center justify-center -my-3 z-10">
          <div className="w-8 h-8 rounded-full bg-cine-dark text-white font-serif font-bold text-xs flex items-center justify-center shadow-md border-2 border-canvas">
            VS
          </div>
        </div>

        {/* Movie 2 Card */}
        <div className="bg-surface rounded-xl border border-cine-border p-4 sm:p-6 shadow-card flex flex-col justify-between">
          <div className="flex gap-3.5 sm:gap-5">
            <img
              src={movie2.poster}
              alt={movie2.title}
              className="w-24 sm:w-32 aspect-[2/3] object-cover rounded-md border border-cine-border shadow-md shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-cine-accent uppercase tracking-wider block truncate">
                {movie2.genres.slice(0, 2).join(' / ')}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-cine-dark mt-1 truncate">
                <Link to={`/movie/${movie2.id}`} className="hover:text-cine-accent transition-colors">
                  {movie2.title}
                </Link>
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-cine-muted mt-1 font-medium">
                <span>{movie2.year}</span>
                <span>•</span>
                <span>{movie2.runtime}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-bold text-cine-gold">
                  <Star className="w-3 h-3 fill-cine-gold" />
                  {movie2.rating.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-cine-body mt-2.5 line-clamp-3 leading-relaxed">
                {movie2.overview}
              </p>
            </div>
          </div>
          <div className="mt-4 sm:mt-5 pt-3 border-t border-cine-border text-[11px] sm:text-xs flex flex-wrap justify-between items-center gap-1 text-cine-muted">
            <span>Director: <strong className="text-cine-dark">{movie2.director}</strong></span>
            <span>Composer: <strong className="text-cine-dark">{movie2.composer}</strong></span>
          </div>
        </div>

      </div>

      {/* Side-by-Side Detailed Metrics Table */}
      <div className="bg-surface rounded-xl border border-cine-border shadow-subtle overflow-hidden mb-12">
        <div className="p-4 bg-surface-muted border-b border-cine-border">
          <h3 className="font-serif text-lg font-bold text-cine-dark">
            Direct Statistical Comparison
          </h3>
        </div>

        <div className="divide-y divide-cine-border text-xs sm:text-sm">
          
          {/* Critical Rating */}
          <div className="grid grid-cols-12 p-4 items-center">
            <div className="col-span-5 font-bold text-cine-dark truncate flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-cine-gold text-cine-gold shrink-0" />
              <span>{movie1.rating.toFixed(1)} / 10</span>
              {movie1.rating > movie2.rating && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded ml-1">Edge</span>
              )}
            </div>
            <div className="col-span-2 text-center text-cine-muted font-bold text-[11px] uppercase tracking-wider">
              CineScore
            </div>
            <div className="col-span-5 text-right font-bold text-cine-dark truncate flex items-center justify-end gap-1">
              {movie2.rating > movie1.rating && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded mr-1">Edge</span>
              )}
              <span>{movie2.rating.toFixed(1)} / 10</span>
              <Star className="w-3.5 h-3.5 fill-cine-gold text-cine-gold shrink-0" />
            </div>
          </div>

          {/* Rotten Tomatoes */}
          <div className="grid grid-cols-12 p-4 items-center bg-canvas/40">
            <div className="col-span-5 font-semibold text-cine-dark">
              {movie1.rottenTomatoes || 85}% Critical
            </div>
            <div className="col-span-2 text-center text-cine-muted font-bold text-[11px] uppercase tracking-wider">
              Rotten Tomatoes
            </div>
            <div className="col-span-5 text-right font-semibold text-cine-dark">
              {movie2.rottenTomatoes || 85}% Critical
            </div>
          </div>

          {/* Metascore */}
          <div className="grid grid-cols-12 p-4 items-center">
            <div className="col-span-5 font-semibold text-cine-dark">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs mr-1">
                {movie1.metascore || 80}
              </span>
              <span>Metacritic</span>
            </div>
            <div className="col-span-2 text-center text-cine-muted font-bold text-[11px] uppercase tracking-wider">
              Metascore
            </div>
            <div className="col-span-5 text-right font-semibold text-cine-dark">
              <span>Metacritic</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs ml-1">
                {movie2.metascore || 80}
              </span>
            </div>
          </div>

          {/* Runtime */}
          <div className="grid grid-cols-12 p-4 items-center bg-canvas/40">
            <div className="col-span-5 font-semibold text-cine-dark">
              {movie1.runtime} ({movie1.runtimeMinutes}m)
            </div>
            <div className="col-span-2 text-center text-cine-muted font-bold text-[11px] uppercase tracking-wider">
              Runtime
            </div>
            <div className="col-span-5 text-right font-semibold text-cine-dark">
              {movie2.runtime} ({movie2.runtimeMinutes}m)
            </div>
          </div>

          {/* Box Office */}
          <div className="grid grid-cols-12 p-4 items-center">
            <div className="col-span-5 font-semibold text-cine-dark">
              {movie1.boxOffice || '$500M+'}
            </div>
            <div className="col-span-2 text-center text-cine-muted font-bold text-[11px] uppercase tracking-wider">
              Box Office
            </div>
            <div className="col-span-5 text-right font-semibold text-cine-dark">
              {movie2.boxOffice || '$500M+'}
            </div>
          </div>

          {/* Production Budget */}
          <div className="grid grid-cols-12 p-4 items-center bg-canvas/40">
            <div className="col-span-5 font-semibold text-cine-dark">
              {movie1.budget || '$150M'}
            </div>
            <div className="col-span-2 text-center text-cine-muted font-bold text-[11px] uppercase tracking-wider">
              Budget
            </div>
            <div className="col-span-5 text-right font-semibold text-cine-dark">
              {movie2.budget || '$150M'}
            </div>
          </div>

          {/* Exhibition Specs */}
          <div className="grid grid-cols-12 p-4 items-center">
            <div className="col-span-5 text-xs text-cine-body">
              {movie1.audioVisualSpecs?.join(', ') || '4K UHD, Dolby Atmos'}
            </div>
            <div className="col-span-2 text-center text-cine-muted font-bold text-[11px] uppercase tracking-wider">
              Specs
            </div>
            <div className="col-span-5 text-right text-xs text-cine-body">
              {movie2.audioVisualSpecs?.join(', ') || '4K UHD, Dolby Atmos'}
            </div>
          </div>

        </div>
      </div>

      {/* Attribute Spectrum Head-to-Head Comparison Bars */}
      <div className="bg-surface rounded-xl border border-cine-border p-6 shadow-subtle mb-12">
        <div className="mb-6 pb-3 border-b border-cine-border flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-cine-dark">
            Directorial & Stylistic Attribute Radar
          </h3>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-cine-accent">
              <span className="w-2.5 h-2.5 rounded-full bg-cine-accent" />
              {movie1.title}
            </span>
            <span className="flex items-center gap-1.5 text-cine-gold">
              <span className="w-2.5 h-2.5 rounded-full bg-cine-gold" />
              {movie2.title}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {attributes.map((attr) => {
            const val1 = movie1.scores?.[attr.key] || 90;
            const val2 = movie2.scores?.[attr.key] || 90;

            return (
              <div key={attr.key}>
                <div className="mb-1.5">
                  <div className="text-center sm:hidden text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
                    {attr.label}
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="font-bold text-cine-accent truncate max-w-[48%] sm:max-w-none">
                      <span className="hidden sm:inline">{movie1.title}: </span>{val1}/100
                    </span>
                    <span className="hidden sm:inline text-cine-dark font-semibold uppercase tracking-wider text-[11px]">
                      {attr.label}
                    </span>
                    <span className="font-bold text-cine-gold text-right truncate max-w-[48%] sm:max-w-none">
                      <span className="hidden sm:inline">{movie2.title}: </span>{val2}/100
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Left Bar (Film 1) */}
                  <div className="w-full bg-surface-muted h-2.5 rounded-l-full overflow-hidden flex justify-end">
                    <div
                      className="bg-cine-accent h-full rounded-l-full"
                      style={{ width: `${val1}%` }}
                    />
                  </div>

                  {/* Right Bar (Film 2) */}
                  <div className="w-full bg-surface-muted h-2.5 rounded-r-full overflow-hidden flex justify-start">
                    <div
                      className="bg-cine-gold h-full rounded-r-full"
                      style={{ width: `${val2}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Synthesis / Verdict Box */}
      <div className="p-6 bg-surface-muted rounded-xl border border-cine-border shadow-subtle">
        <h3 className="font-serif text-lg font-bold text-cine-dark mb-2">
          Curator's Comparative Verdict
        </h3>
        <p className="text-xs sm:text-sm text-cine-body leading-relaxed max-w-3xl">
          While <strong className="text-cine-dark">{movie1.title}</strong> shines with unparalleled tactile physical world-building and breathtaking cinematic staging, <strong className="text-cine-dark">{movie2.title}</strong> delivers a profoundly moving emotional anchor and transcendent score. Both stand as monumental triumphs of 21st-century speculative cinema that demand exhibition on the largest possible canvas.
        </p>
      </div>

    </div>
  );
}
