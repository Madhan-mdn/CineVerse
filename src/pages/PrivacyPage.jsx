import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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

      {/* Main Container */}
      <div className="bg-surface rounded-2xl border border-surface-border p-6 sm:p-10 shadow-card space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
        
        <div className="border-b border-surface-border pb-6">
          <span className="text-[11px] font-bold tracking-widest text-cine-accent uppercase block mb-1">
            Data & Privacy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-cine-muted mt-1 font-medium">
            Last Updated: 2026
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-white">
            1. Client-Side Local Storage
          </h2>
          <p>
            CineVerse operates strictly as a front-end movie discovery web application. Your saved Watchlist and Favorite movies are saved exclusively in your browser's <code className="bg-canvas px-1.5 py-0.5 rounded text-white font-mono text-xs">localStorage</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-white">
            2. No Tracking or User Profiling
          </h2>
          <p>
            We do not use tracking cookies, analytics trackers, or third-party profiling scripts. Search queries and filter selections are processed directly in your browser.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-white">
            3. Third-Party Services (TMDB & YouTube)
          </h2>
          <p>
            When searching for movies or viewing movie details, queries are sent directly to the TMDB API to fetch movie posters, metadata, and cast details. Trailer videos are embedded via YouTube's privacy-enhanced embed player.
          </p>
        </section>

      </div>
    </div>
  );
}
