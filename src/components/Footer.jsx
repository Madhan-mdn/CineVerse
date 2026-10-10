import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Bookmark, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t border-surface-border bg-surface/50 mt-20 pt-12 pb-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 pb-12 border-b border-surface-border">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cine-accent text-white flex items-center justify-center font-brand font-bold text-sm shadow-subtle">
                C
              </div>
              <span className="font-brand font-bold text-lg tracking-wider text-white">
                CINEVERSE
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-normal max-w-sm">
              A modern movie discovery platform where you can explore trending titles, discover top-rated films, search across genres, view details, and manage your personal watchlist and favorites.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cine-accent transition-colors">
                  Home
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/explore" className="hover:text-cine-accent transition-colors">
                      Explore Movies
                    </Link>
                  </li>
                  <li>
                    <Link to="/watchlist" className="hover:text-cine-accent transition-colors">
                      My Watchlist
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="hover:text-cine-accent transition-colors">
                      Favorites
                    </Link>
                  </li>
                </>
              ) : (
                <li className="pt-1">
                  <Link to="/login" className="hover:text-cine-accent transition-colors text-slate-300">
                    Sign In
                  </Link>
                  <span className="mx-2 text-slate-600">•</span>
                  <Link to="/register" className="hover:text-cine-accent transition-colors text-slate-300">
                    Register
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Attribution & Notice */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200">
              TMDB Attribution
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="leading-relaxed">
                Movie metadata, images, posters, and trailers are powered by The Movie Database (TMDB).
              </p>
              <div className="p-3 rounded-lg bg-surface border border-surface-border text-[11px] leading-snug text-slate-300">
                This product uses the TMDB API but is not endorsed or certified by TMDB.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CineVerse. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Fast & Responsive</span>
            <span>•</span>
            <span>Local Storage Persistence</span>
            <span>•</span>
            <span>Powered by TMDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
