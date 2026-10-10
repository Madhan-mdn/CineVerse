import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Bookmark, 
  Heart, 
  Menu, 
  X,
  LogIn,
  UserPlus,
  LogOut,
  User
} from 'lucide-react';
import { useMovieContext } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

/**
 * Shared Brand Logo Component
 */
function BrandLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
      <div className="w-8 h-8 rounded-lg bg-cine-accent text-white flex items-center justify-center font-brand font-bold text-base shadow-subtle group-hover:scale-105 transition-transform">
        C
      </div>
      <div className="flex flex-col">
        <span className="font-brand font-bold text-lg sm:text-xl tracking-wider text-white leading-none">
          CINEVERSE
        </span>
        <span className="text-[10px] uppercase tracking-wider text-cine-muted font-medium">
          Movie Discovery
        </span>
      </div>
    </Link>
  );
}

/**
 * Guest Navbar State — User Is Not Logged In
 * Displays ONLY:
 * - Application logo / name
 * - Login button
 * - Register button
 * Does NOT display:
 * - Movies or Explore Movies
 * - Watchlist
 * - Favorites
 * - Search bar
 * - Profile or account menu
 * - Logout
 */
function GuestNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-surface-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <BrandLogo />

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-surface transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold bg-cine-accent hover:bg-cine-accent-hover text-white transition-colors flex items-center gap-1.5 shadow-subtle"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Authenticated Navbar State — User Is Logged In
 * Displays:
 * - Application logo / name
 * - Home
 * - Movies / Explore Movies
 * - Watchlist (with count badge)
 * - Favorites (with count badge)
 * - Search bar
 * - Profile / User's name
 * - Logout button
 * - Responsive mobile drawer with the above links
 */
function AuthenticatedNavbar({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { watchlistCount, favoritesCount } = useMovieContext();

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore Movies' },
    { 
      to: '/watchlist', 
      label: 'My Watchlist', 
      badge: watchlistCount > 0 ? watchlistCount : null,
      icon: Bookmark 
    },
    { 
      to: '/favorites', 
      label: 'Favorites', 
      badge: favoritesCount > 0 ? favoritesCount : null,
      icon: Heart 
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-surface-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          <BrandLogo />

          {/* Desktop & Tablet Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `
                  px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5
                  ${isActive 
                    ? 'text-white font-semibold bg-surface-muted border border-surface-border' 
                    : 'text-slate-300 hover:text-white hover:bg-surface/60'}
                `}
              >
                {link.icon && (
                  <link.icon className={`w-3.5 h-3.5 ${link.to === '/favorites' && link.badge ? 'text-rose-500 fill-current' : ''}`} />
                )}
                <span>{link.label}</span>
                {link.badge !== null && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cine-accent text-white leading-none">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Search Box in Header */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs ml-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface border border-surface-border rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:border-cine-accent transition-colors shadow-subtle"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>

          {/* User Profile & Logout (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-surface-border text-xs font-medium text-slate-200">
                <div className="w-5 h-5 rounded-full bg-cine-accent/20 border border-cine-accent/40 text-cine-accent flex items-center justify-center text-[10px] font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user?.name || 'User'}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-muted text-slate-300 hover:text-rose-400 border border-surface-border text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-subtle"
                title="Log out of session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-surface-border bg-surface text-slate-200 hover:text-white transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-surface-border space-y-3 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-surface border border-surface-border rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-cine-accent"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-cine-accent text-white font-semibold' 
                      : 'text-slate-300 hover:bg-surface hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== null && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-cine-dark">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Mobile User Profile & Logout */}
            <div className="pt-3 border-t border-surface-border space-y-2">
              <div className="px-3.5 py-2 rounded-lg bg-surface text-xs text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 text-cine-accent" />
                <span>Signed in as <strong className="text-white">{user?.name}</strong></span>
              </div>
              <button
                onClick={onLogout}
                className="w-full px-3.5 py-2.5 rounded-lg bg-surface hover:bg-surface-muted text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 border border-surface-border cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/**
 * Main Navbar Component
 * Selects between AuthenticatedNavbar and GuestNavbar strictly based on AuthContext state
 */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return isAuthenticated ? (
    <AuthenticatedNavbar user={user} onLogout={handleLogout} />
  ) : (
    <GuestNavbar />
  );
}
