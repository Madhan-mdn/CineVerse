import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Star, 
  Clock, 
  Film, 
  Bookmark, 
  Tv, 
  Sliders, 
  Check, 
  MapPin, 
  Calendar,
  Layers,
  Edit3,
  ExternalLink,
  LogOut,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getMovieById, MOVIES } from '../data/moviesData';
import MovieCard from '../components/MovieCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, toggleConnectedService, updateProfile, updateTopFavorites } = useAuth();
  const { watchlist, watchedCount, totalCount } = useWatchlist();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user?.bio || '');
  const [locationText, setLocationText] = useState(user?.location || '');
  const [editingFavorites, setEditingFavorites] = useState(false);

  if (!user) {
    return null;
  }

  const topFavoritesMovies = (user.topFavorites || [])
    .map(id => getMovieById(id))
    .filter(Boolean);

  const handleSaveBio = async () => {
    try {
      await updateProfile({ bio: bioText, location: locationText });
      setIsEditingBio(false);
    } catch (err) {
      console.error('Failed to save profile bio:', err);
    }
  };

  const services = [
    { key: 'netflix', name: 'Netflix', status: user.connectedServices?.netflix },
    { key: 'max', name: 'HBO Max', status: user.connectedServices?.max },
    { key: 'criterion', name: 'The Criterion Channel', status: user.connectedServices?.criterion },
    { key: 'appleTv', name: 'Apple TV+', status: user.connectedServices?.appleTv },
    { key: 'prime', name: 'Amazon Prime Video', status: user.connectedServices?.prime }
  ];

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Editorial Profile Header Card */}
      <div className="bg-surface rounded-xl border border-cine-border p-6 sm:p-8 lg:p-10 shadow-card mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-cine-border">
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="relative shrink-0">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=1c1917&textColor=ffffff`}
                alt={user.name}
                className="w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 rounded-full object-cover ring-2 ring-cine-border shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Active Curator" />
            </div>

            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-cine-accent block mb-1">
                Verified Archival Curator
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cine-dark">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cine-muted mt-1 font-medium">
                <span>@{user.username}</span>
                <span>•</span>
                <span className="truncate max-w-[200px]">{user.email}</span>
                {user.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cine-muted" />
                      {user.location}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cine-muted" />
                  Member since {user.memberSince}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Link
              to="/watchlist"
              className="px-3.5 py-2 rounded-md bg-cine-dark text-white text-xs font-semibold hover:bg-cine-accent transition-colors shadow-subtle"
            >
              View Watchlist
            </Link>

            <button
              onClick={handleSignOut}
              className="px-3 py-2 rounded-md border border-cine-border bg-canvas hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold text-cine-body transition-colors flex items-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

        </div>

        {/* Bio Section */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs uppercase font-bold text-cine-dark tracking-wider">
              Curator's Manifesto & Taste Bio
            </h3>
            {!isEditingBio && (
              <button
                onClick={() => {
                  setBioText(user.bio || '');
                  setLocationText(user.location || '');
                  setIsEditingBio(true);
                }}
                className="text-[11px] text-cine-accent hover:underline flex items-center gap-1 font-semibold"
              >
                <Edit3 className="w-3 h-3" />
                <span>{user.bio ? 'Edit Bio' : 'Add Bio'}</span>
              </button>
            )}
          </div>

          {isEditingBio ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-canvas border border-cine-border rounded-md px-3 py-1.5 text-xs text-cine-dark focus:outline-none focus:border-cine-accent mb-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-cine-dark uppercase tracking-wider mb-1">
                  Taste Bio / Manifesto
                </label>
                <textarea
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  rows={3}
                  placeholder="Share your cinema philosophy, favorite formats, directors, or eras..."
                  className="w-full bg-canvas border border-cine-border rounded-md p-3 text-xs sm:text-sm text-cine-dark focus:outline-none focus:border-cine-accent"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-3 py-1.5 rounded text-xs text-cine-muted hover:text-cine-dark"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBio}
                  className="px-3.5 py-1.5 rounded bg-cine-dark text-white text-xs font-semibold hover:bg-cine-accent"
                >
                  Save Manifesto
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-cine-body leading-relaxed font-normal max-w-3xl">
              {user.bio ? `"${user.bio}"` : (
                <span className="text-cine-muted italic">
                  No manifesto bio added yet. Click 'Add Bio' above to outline your cinema perspective.
                </span>
              )}
            </p>
          )}
        </div>

      </div>

      {/* All-Time Favorite Top 4 Showcase */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-cine-border">
          <div>
            <h2 className="font-serif text-2xl font-bold text-cine-dark">
              All-Time Favorite Top 4
            </h2>
            <p className="text-xs text-cine-muted mt-0.5">
              The four foundational films defining your aesthetic sensibility
            </p>
          </div>

          <button
            onClick={() => setEditingFavorites(!editingFavorites)}
            className="text-xs font-semibold text-cine-accent hover:underline flex items-center gap-1"
          >
            <span>{editingFavorites ? 'Done Choosing' : 'Select Top 4'}</span>
          </button>
        </div>

        {editingFavorites && (
          <div className="mb-6 p-4 bg-surface-muted rounded-lg border border-cine-border animate-fade-in">
            <span className="text-xs font-semibold text-cine-dark block mb-2">
              Select up to 4 films ({user.topFavorites?.length || 0}/4 selected):
            </span>
            <div className="flex flex-wrap gap-2">
              {MOVIES.map(m => {
                const isSelected = (user.topFavorites || []).includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      const current = user.topFavorites || [];
                      if (isSelected) {
                        updateTopFavorites(current.filter(id => id !== m.id));
                      } else if (current.length < 4) {
                        updateTopFavorites([...current, m.id]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                      isSelected
                        ? 'bg-cine-dark text-white border-cine-dark font-bold'
                        : 'bg-surface text-cine-body border-cine-border hover:bg-surface-subtle'
                    }`}
                  >
                    {m.title} {isSelected ? '✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {topFavoritesMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {topFavoritesMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface rounded-xl border border-cine-border text-xs text-cine-muted">
            <p className="mb-3">You haven't designated your Top 4 films yet.</p>
            <button
              onClick={() => setEditingFavorites(true)}
              className="px-3.5 py-1.5 rounded bg-cine-dark text-white text-xs font-semibold hover:bg-cine-accent inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Your Top 4</span>
            </button>
          </div>
        )}
      </section>

      {/* 2-Column Section: Connected Streaming Services & Exhibition Preferences */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left Column (6 cols): Connected Services */}
        <div className="lg:col-span-6 bg-surface rounded-xl border border-cine-border p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-cine-border">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-cine-accent" />
                <h3 className="font-serif text-lg font-bold text-cine-dark">
                  Connected Streaming Platforms
                </h3>
              </div>
              <span className="text-[11px] text-cine-muted font-medium">Availability Filters</span>
            </div>

            <p className="text-xs text-cine-muted mb-5 leading-relaxed">
              Enable your active memberships to highlight immediate streaming availability across discovery shelves.
            </p>

            <div className="space-y-3">
              {services.map(svc => (
                <div
                  key={svc.key}
                  className="flex items-center justify-between p-3 rounded-lg bg-canvas border border-cine-border"
                >
                  <span className="text-xs font-semibold text-cine-dark">
                    {svc.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleConnectedService(svc.key)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      svc.status
                        ? 'bg-emerald-700 text-white shadow-subtle'
                        : 'bg-surface-muted text-cine-muted hover:text-cine-dark'
                    }`}
                  >
                    {svc.status ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-cine-muted mt-6 pt-3 border-t border-cine-border">
            Streaming provider integration synchronizes directly with your account profile in the persistent store.
          </p>
        </div>

        {/* Right Column (6 cols): Exhibition & Preferences */}
        <div className="lg:col-span-6 bg-surface rounded-xl border border-cine-border p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-cine-border">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cine-accent" />
                <h3 className="font-serif text-lg font-bold text-cine-dark">
                  Exhibition Preferences
                </h3>
              </div>
              <span className="text-[11px] text-cine-muted font-medium">Aesthetic Defaults</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1">
                  Default Technical Audio Priority
                </label>
                <select className="w-full bg-canvas border border-cine-border rounded px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent">
                  <option>Dolby Atmos / TrueHD 7.1</option>
                  <option>DTS-HD Master Audio</option>
                  <option>Original Theatrical Stereo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1">
                  Subtitles & Caption Display
                </label>
                <select className="w-full bg-canvas border border-cine-border rounded px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent">
                  <option>Always On for Foreign Dialog</option>
                  <option>Always On (SDH)</option>
                  <option>Off by Default</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-cine-dark uppercase tracking-wider mb-1">
                  Critical Rating Metric Base
                </label>
                <select className="w-full bg-canvas border border-cine-border rounded px-3 py-2 text-xs text-cine-dark focus:outline-none focus:border-cine-accent">
                  <option>10-Point CineScore Decimal (8.7/10)</option>
                  <option>Letterboxd 5-Star Fractional</option>
                  <option>Rotten Tomatoes Fresh %</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-cine-border flex items-center justify-between text-xs">
            <span className="text-cine-muted font-medium">Session: Encrypted Persistent Archival Profile</span>
            <span className="text-emerald-700 font-bold">Synchronized</span>
          </div>
        </div>

      </div>

    </div>
  );
}
