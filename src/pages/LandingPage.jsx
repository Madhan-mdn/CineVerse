import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Bookmark, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  Film, 
  CheckCircle2, 
  Star,
  Play,
  LogIn,
  UserPlus
} from 'lucide-react';
import { getTrendingMovies, getPopularMovies } from '../api/tmdb';
import { useAuth } from '../context/AuthContext';
import MovieShelf from '../components/MovieShelf';
import { LoadingSkeletonGrid } from '../components/LoadingSkeleton';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLandingData() {
      try {
        setLoading(true);
        const [trendingRes, popularRes] = await Promise.all([
          getTrendingMovies(1),
          getPopularMovies(1)
        ]);
        if (isMounted) {
          setTrendingMovies(trendingRes.movies || trendingRes.results || []);
          setPopularMovies(popularRes.movies || popularRes.results || []);
        }
      } catch (err) {
        console.error('Error fetching landing page movies:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLandingData();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredBackdrop = trendingMovies[0]?.backdrop || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80';

  const features = [
    {
      icon: Compass,
      title: 'Effortless Discovery',
      description: 'Search millions of movies by title or filter seamlessly by genres, release year, minimum rating, and sort order.'
    },
    {
      icon: Bookmark,
      title: 'Personal Watchlist',
      description: 'Save films you plan to watch later with a single click. Keep track of your movie queue locally in your browser.'
    },
    {
      icon: Heart,
      title: 'Curated Favorites',
      description: 'Build your personal collection of all-time favorite masterpieces, always preserved across your sessions.'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Cinematic Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-24 border-b border-surface-border">
        {/* Subtle backdrop image with deep dark gradient overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img
            src={featuredBackdrop}
            alt="Cinematic Backdrop"
            className="w-full h-full object-cover object-center filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-surface-border shadow-subtle mb-6 animate-fade-in">
            <div className="w-4 h-4 rounded bg-cine-accent text-white flex items-center justify-center font-brand font-bold text-[10px]">
              C
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Modern Movie Discovery
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight max-w-4xl mx-auto mb-6">
            Discover Your Next Favorite Movie
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Explore trending releases, all-time classics, and upcoming cinema. Search across genres, view detailed cast and trailers, and maintain your personal watchlist and favorites.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto mb-16">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-cine-accent hover:bg-cine-accent-hover text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-card cursor-pointer group"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Movies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {!isAuthenticated ? (
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-muted text-white border border-surface-border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-subtle cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-cine-accent" />
                <span>Create Free Account</span>
              </Link>
            ) : (
              <Link
                to="/watchlist"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-surface hover:bg-surface-muted text-white border border-surface-border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-subtle cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-cine-accent" />
                <span>View My Watchlist</span>
              </Link>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-surface-border/60 text-center">
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white">500,000+</div>
              <div className="text-[11px] text-cine-muted font-medium mt-0.5">Movies Indexed</div>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white">Daily</div>
              <div className="text-[11px] text-cine-muted font-medium mt-0.5">Trending Updates</div>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white">100% Free</div>
              <div className="text-[11px] text-cine-muted font-medium mt-0.5">No Subscription</div>
            </div>
            <div>
              <div className="font-serif text-xl sm:text-2xl font-bold text-white">Local Storage</div>
              <div className="text-[11px] text-cine-muted font-medium mt-0.5">Private Saved Lists</div>
            </div>
          </div>

        </div>
      </section>

      {/* Selected Movie Showcases (Trending & Popular) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {loading ? (
          <div className="space-y-12">
            <div>
              <div className="h-6 w-48 bg-slate-800 animate-pulse rounded mb-4" />
              <LoadingSkeletonGrid count={5} />
            </div>
          </div>
        ) : (
          <>
            {/* Trending Shelf */}
            <MovieShelf
              title="Trending This Week"
              subtitle="The most popular theatrical and streaming titles dominating discussions right now"
              movies={trendingMovies.slice(0, 10)}
              viewAllLink="/explore?sort=popularity.desc"
            />

            {/* Popular Shelf */}
            <MovieShelf
              title="Popular Movies"
              subtitle="High-caliber cinema and audience favorites with stellar ratings"
              movies={popularMovies.slice(0, 10)}
              viewAllLink="/explore?sort=popularity.desc"
            />
          </>
        )}
      </section>

      {/* Feature Section: Discovery, Watchlist, Favorites */}
      <section className="bg-surface/50 border-y border-surface-border py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-2">
              Everything You Need
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Designed for Film Lovers
            </h2>
            <p className="text-xs sm:text-sm text-cine-muted mt-2">
              Simple, modern tools to help you discover great movies and organize your watch queue.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-surface border border-surface-border shadow-card flex flex-col justify-between hover:border-slate-600 transition-colors"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-cine-accent/15 border border-cine-accent/30 flex items-center justify-center text-cine-accent mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-surface-border shadow-card max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-cine-accent text-white flex items-center justify-center mx-auto mb-4 font-brand font-bold text-lg shadow-card">
            C
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">
            Start Exploring Movies Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-8 leading-relaxed">
            Browse through curated titles, watch official trailers, and start building your personalized watchlist in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cine-accent hover:bg-cine-accent-hover text-white text-xs sm:text-sm font-semibold transition-all shadow-subtle cursor-pointer"
            >
              Browse Movies Now
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface-muted hover:bg-slate-700 text-white border border-surface-border text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
