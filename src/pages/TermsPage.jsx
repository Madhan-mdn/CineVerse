import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Return link */}
      <div className="mb-6">
        <Link
          to="/"
          className="text-xs font-semibold text-cine-muted hover:text-white transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Main Text Container */}
      <div className="bg-surface rounded-2xl border border-surface-border p-6 sm:p-10 shadow-card space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        
        <div className="border-b border-surface-border pb-6">
          <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-1">
            Usage Policy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-cine-muted mt-1 font-medium">
            Last Updated: 2026
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-white">
            1. Nature of the Platform
          </h2>
          <p>
            CineVerse is a web application designed for discovering movies, exploring genres, searching titles, and maintaining a personal watchlist and favorites list stored in your web browser.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-white">
            2. TMDB API Attribution
          </h2>
          <p>
            This product uses the TMDB API to display movie information, posters, trailers, and ratings, but is not endorsed or certified by TMDB. All movie content and trademarks belong to their respective copyright holders.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-white">
            3. Local Storage Data
          </h2>
          <p>
            Your watchlist and favorite movies are stored locally on your device via browser localStorage. No personal data is collected or sent to external servers.
          </p>
        </section>

      </div>
    </div>
  );
}
