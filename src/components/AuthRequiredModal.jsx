import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Heart, X, LogIn, UserPlus } from 'lucide-react';

export default function AuthRequiredModal({ 
  isOpen, 
  onClose, 
  title = "Sign In Required", 
  message = "Sign in to save your favorite movies and build your personal watchlist." 
}) {
  const location = useLocation();

  // Close modal when pressing Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Build current return target URL so the user returns to what they were viewing
  const currentPath = location ? (location.pathname + location.search) : '/explore';
  const encodedRedirect = encodeURIComponent(currentPath);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-surface border border-surface-border rounded-2xl shadow-card p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close 'X' Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-muted transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-14 h-14 rounded-2xl bg-cine-accent/15 border border-cine-accent/30 text-cine-accent flex items-center justify-center mx-auto mb-5 shadow-subtle">
          <div className="flex items-center -space-x-1">
            <Bookmark className="w-6 h-6 fill-cine-accent text-cine-accent" />
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 -ml-1" />
          </div>
        </div>

        {/* Title */}
        <h3 id="auth-modal-title" className="font-serif text-2xl font-bold text-white mb-2.5">
          {title}
        </h3>

        {/* Message */}
        <p className="text-xs sm:text-sm text-cine-muted leading-relaxed mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mb-4">
          <Link
            to={`/login?redirect=${encodedRedirect}`}
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-cine-accent hover:bg-cine-accent-hover text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-subtle cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </Link>

          <Link
            to={`/register?redirect=${encodedRedirect}`}
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl bg-surface-muted hover:bg-surface-subtle text-slate-200 hover:text-white border border-surface-border text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </Link>
        </div>

        {/* Cancel / Dismiss Option */}
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors py-1 cursor-pointer"
        >
          Cancel and continue browsing
        </button>
      </div>
    </div>
  );
}
