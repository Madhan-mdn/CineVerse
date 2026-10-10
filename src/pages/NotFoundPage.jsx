import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, Search, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center min-h-[calc(100vh-260px)]">
      <div className="text-center max-w-lg bg-surface rounded-2xl border border-surface-border p-8 sm:p-12 shadow-card">
        
        <div className="w-16 h-16 rounded-full bg-surface-muted border border-surface-border flex items-center justify-center mx-auto mb-6 text-cine-muted">
          <Film className="w-8 h-8 stroke-1 text-slate-400" />
        </div>

        <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-1">
          404 Error • Page Not Found
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
          Movie Reel Not Found
        </h1>

        <p className="text-xs sm:text-sm text-cine-muted leading-relaxed mb-8 font-normal">
          The page or movie title you are looking for does not exist or may have been moved.
        </p>

        {/* Quick Search Field */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search movie titles..."
            className="w-full bg-canvas border border-surface-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cine-accent"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-lg bg-cine-accent text-white text-xs font-semibold hover:bg-cine-accent-hover transition-colors flex items-center gap-1.5 shadow-subtle cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-lg border border-surface-border bg-surface text-slate-200 text-xs font-semibold hover:bg-surface-muted transition-colors cursor-pointer"
          >
            Explore Movies
          </Link>
        </div>

      </div>
    </div>
  );
}
