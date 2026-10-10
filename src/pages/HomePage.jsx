import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Compass, Sparkles, Film, ArrowRight, Flame, Trophy, Clapperboard, Calendar } from 'lucide-react';
import Hero from '../components/Hero';
import MovieShelf from '../components/MovieShelf';
import { LoadingSkeletonGrid } from '../components/LoadingSkeleton';
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies 
} from '../api/tmdb';

const POPULAR_GENRE_PILLS = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Horror',
  'Romance',
  'Science Fiction',
  'Thriller'
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Movie shelf states
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAllShelves() {
      try {
        setLoading(true);
        const [trendingRes, popularRes, topRatedRes, upcomingRes] = await Promise.all([
          getTrendingMovies(1),
          getPopularMovies(1),
          getTopRatedMovies(1),
          getUpcomingMovies(1)
        ]);

        if (isMounted) {
          setTrendingMovies(trendingRes.movies || trendingRes.results || []);
          setPopularMovies(popularRes.movies || popularRes.results || []);
          setTopRatedMovies(topRatedRes.movies || topRatedRes.results || []);
          setUpcomingMovies(upcomingRes.movies || upcomingRes.results || []);
        }
      } catch (err) {
        console.error('Error loading movie shelves:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAllShelves();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Top 3 trending movies for the Hero Spotlight
  const heroMovies = (trendingMovies.length > 0 ? trendingMovies : popularMovies).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
      {/* Welcoming Heading & Prominent Search Bar */}
      <div className="mb-10 sm:mb-14 p-6 sm:p-10 rounded-2xl bg-surface border border-surface-border shadow-card text-center max-w-4xl mx-auto">
        <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-2">
          Explore Cinema
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
          Discover Your Next Favorite Movie
        </h1>
        <p className="text-xs sm:text-sm text-cine-muted max-w-xl mx-auto mb-6 leading-relaxed">
          Search millions of titles, browse popular releases, top-rated masterpieces, and upcoming theatrical premieres across all genres.
        </p>

        {/* Prominent Search Box */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center shadow-card">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title (e.g., Interstellar, Inception, Gladiator)..."
            className="w-full pl-11 pr-28 py-3.5 rounded-xl border border-surface-border bg-canvas text-xs sm:text-sm text-white focus:outline-none focus:border-cine-accent transition-all placeholder:text-slate-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-1.5 px-5 py-2.5 rounded-lg bg-cine-accent hover:bg-cine-accent-hover text-white text-xs font-semibold transition-colors cursor-pointer shadow-subtle"
          >
            Search
          </button>
        </form>

        {/* Popular Genre Collections Quick Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">
            Collections:
          </span>
          {POPULAR_GENRE_PILLS.map((genre) => (
            <Link
              key={genre}
              to={`/explore?genre=${encodeURIComponent(genre)}`}
              className="px-3 py-1 rounded-full text-xs font-medium border border-surface-border bg-canvas hover:bg-surface-muted hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            >
              {genre}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Spotlight Banner */}
      {heroMovies.length > 0 && <Hero featuredMovies={heroMovies} />}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="space-y-12 my-8">
          <div>
            <div className="h-6 w-48 bg-slate-800 animate-pulse rounded mb-4" />
            <LoadingSkeletonGrid count={5} />
          </div>
          <div>
            <div className="h-6 w-48 bg-slate-800 animate-pulse rounded mb-4" />
            <LoadingSkeletonGrid count={5} />
          </div>
        </div>
      ) : (
        <>
          {/* Shelf 1: Trending Movies */}
          <MovieShelf
            title="Trending Movies"
            subtitle="The most talked about films across cinema right now"
            movies={trendingMovies}
            viewAllLink="/explore?sort=popularity.desc"
          />

          {/* Shelf 2: Popular Movies */}
          <MovieShelf
            title="Popular Movies"
            subtitle="Current fan-favorites and widely streamed movies"
            movies={popularMovies}
            viewAllLink="/explore?sort=popularity.desc"
          />

          {/* Shelf 3: Top Rated Movies */}
          <MovieShelf
            title="Top Rated Movies"
            subtitle="Critically acclaimed films with the highest viewer ratings"
            movies={topRatedMovies}
            viewAllLink="/explore?sort=vote_average.desc"
          />

          {/* Shelf 4: Upcoming Movies */}
          <MovieShelf
            title="Upcoming Movies"
            subtitle="Anticipated theatrical premieres and upcoming releases"
            movies={upcomingMovies}
            viewAllLink="/explore?sort=primary_release_date.desc"
          />
        </>
      )}

      {/* Explore More Call-To-Action */}
      <div className="mt-14 p-8 sm:p-12 rounded-2xl bg-surface border border-surface-border text-center shadow-card flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-cine-accent/15 border border-cine-accent/30 text-cine-accent flex items-center justify-center mb-4">
          <Clapperboard className="w-7 h-7" />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
          Looking for Something Specific?
        </h3>
        <p className="text-xs sm:text-sm text-cine-muted max-w-lg mb-6 leading-relaxed">
          Filter by genre, release year, or rating to find the perfect film for your next movie night.
        </p>
        <Link
          to="/explore"
          className="px-6 py-3 rounded-xl bg-cine-accent hover:bg-cine-accent-hover text-white font-semibold text-sm transition-colors shadow-subtle inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Explore All Movies</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
