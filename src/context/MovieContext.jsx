import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import AuthRequiredModal from '../components/AuthRequiredModal';

const MovieContext = createContext();

/**
 * Storage helpers for isolated per-user collections
 */
const getWatchlistKey = (userId) => userId ? `movieAppWatchlist_${userId}` : null;
const getFavoritesKey = (userId) => userId ? `movieAppFavorites_${userId}` : null;

function loadUserWatchlist(userId) {
  if (!userId) return [];
  try {
    const key = getWatchlistKey(userId);
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    // Migration fallback from legacy key if exists
    const legacyRaw = window.localStorage.getItem('cineverse_watchlist');
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        window.localStorage.setItem(key, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load user watchlist from localStorage:', e);
  }
  return [];
}

function loadUserFavorites(userId) {
  if (!userId) return [];
  try {
    const key = getFavoritesKey(userId);
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    // Migration fallback from legacy key if exists
    const legacyRaw = window.localStorage.getItem('cineverse_favorites');
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        window.localStorage.setItem(key, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load user favorites from localStorage:', e);
  }
  return [];
}

function saveUserWatchlist(userId, items) {
  if (!userId) return;
  try {
    window.localStorage.setItem(getWatchlistKey(userId), JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save user watchlist to localStorage:', e);
  }
}

function saveUserFavorites(userId, items) {
  if (!userId) return;
  try {
    window.localStorage.setItem(getFavoritesKey(userId), JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save user favorites to localStorage:', e);
  }
}

export function MovieProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const userId = (isAuthenticated && user?.id) ? user.id : null;

  // Initialize per-user collections synchronously to prevent layout shifts
  const [watchlist, setWatchlist] = useState(() => {
    return userId ? loadUserWatchlist(userId) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    return userId ? loadUserFavorites(userId) : [];
  });

  // Auth requirement modal state
  const [authModalConfig, setAuthModalConfig] = useState({
    isOpen: false,
    title: 'Sign In Required',
    message: 'Sign in to save your favorite movies and build your personal watchlist.'
  });

  // Re-synchronize collections when user changes (login, logout, account switch)
  useEffect(() => {
    if (userId) {
      setWatchlist(loadUserWatchlist(userId));
      setFavorites(loadUserFavorites(userId));
    } else {
      setWatchlist([]);
      setFavorites([]);
    }
  }, [userId]);

  // Request authentication popup
  const requestAuth = useCallback((customMessage, customTitle) => {
    setAuthModalConfig({
      isOpen: true,
      title: customTitle || 'Sign In Required',
      message: customMessage || 'Sign in to save your favorite movies and build your personal watchlist.'
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalConfig(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Standardize movie item structure for saving
  const formatMovieItem = (movie) => {
    if (!movie) return null;
    return {
      id: movie.id,
      title: movie.title || movie.name || 'Untitled',
      originalTitle: movie.originalTitle || movie.original_title || movie.title || '',
      poster: movie.poster || movie.poster_path || '',
      backdrop: movie.backdrop || movie.backdrop_path || '',
      rating: typeof movie.rating === 'number' ? movie.rating : (movie.vote_average || 0),
      voteCount: movie.voteCount || movie.vote_count || 0,
      year: movie.year || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : (movie.release_date ? new Date(movie.release_date).getFullYear() : '')),
      releaseDate: movie.releaseDate || movie.release_date || '',
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      overview: movie.overview || '',
      addedAt: new Date().toISOString()
    };
  };

  // Watchlist methods with strict authentication guards
  const isInWatchlist = useCallback((movieId) => {
    if (!userId || !movieId) return false;
    return watchlist.some(item => String(item.id) === String(movieId));
  }, [userId, watchlist]);

  const addToWatchlist = useCallback((movie) => {
    if (!userId) {
      requestAuth('Sign in to save your favorite movies and build your personal watchlist.');
      return false;
    }
    if (!movie || !movie.id) return false;
    const formatted = formatMovieItem(movie);
    setWatchlist(prev => {
      if (prev.some(item => String(item.id) === String(movie.id))) {
        return prev;
      }
      const updated = [formatted, ...prev];
      saveUserWatchlist(userId, updated);
      return updated;
    });
    return true;
  }, [userId, requestAuth]);

  const removeFromWatchlist = useCallback((movieId) => {
    if (!userId) {
      requestAuth('Sign in to manage your watchlist.');
      return false;
    }
    if (!movieId) return false;
    setWatchlist(prev => {
      const updated = prev.filter(item => String(item.id) !== String(movieId));
      saveUserWatchlist(userId, updated);
      return updated;
    });
    return true;
  }, [userId, requestAuth]);

  const toggleWatchlist = useCallback((movie) => {
    if (!userId) {
      requestAuth('Sign in to save your favorite movies and build your personal watchlist.');
      return false;
    }
    if (!movie) return false;
    const movieId = movie.id || movie;
    if (isInWatchlist(movieId)) {
      removeFromWatchlist(movieId);
      return false;
    } else {
      addToWatchlist(typeof movie === 'object' ? movie : { id: movie });
      return true;
    }
  }, [userId, isInWatchlist, removeFromWatchlist, addToWatchlist, requestAuth]);

  const clearWatchlist = useCallback(() => {
    if (!userId) return;
    setWatchlist([]);
    saveUserWatchlist(userId, []);
  }, [userId]);

  // Favorites methods with strict authentication guards
  const isFavorite = useCallback((movieId) => {
    if (!userId || !movieId) return false;
    return favorites.some(item => String(item.id) === String(movieId));
  }, [userId, favorites]);

  const addToFavorites = useCallback((movie) => {
    if (!userId) {
      requestAuth('Sign in to save your favorite movies and build your personal watchlist.');
      return false;
    }
    if (!movie || !movie.id) return false;
    const formatted = formatMovieItem(movie);
    setFavorites(prev => {
      if (prev.some(item => String(item.id) === String(movie.id))) {
        return prev;
      }
      const updated = [formatted, ...prev];
      saveUserFavorites(userId, updated);
      return updated;
    });
    return true;
  }, [userId, requestAuth]);

  const removeFromFavorites = useCallback((movieId) => {
    if (!userId) {
      requestAuth('Sign in to manage your favorites.');
      return false;
    }
    if (!movieId) return false;
    setFavorites(prev => {
      const updated = prev.filter(item => String(item.id) !== String(movieId));
      saveUserFavorites(userId, updated);
      return updated;
    });
    return true;
  }, [userId, requestAuth]);

  const toggleFavorite = useCallback((movie) => {
    if (!userId) {
      requestAuth('Sign in to save your favorite movies and build your personal watchlist.');
      return false;
    }
    if (!movie) return false;
    const movieId = movie.id || movie;
    if (isFavorite(movieId)) {
      removeFromFavorites(movieId);
      return false;
    } else {
      addToFavorites(typeof movie === 'object' ? movie : { id: movie });
      return true;
    }
  }, [userId, isFavorite, removeFromFavorites, addToFavorites, requestAuth]);

  const clearFavorites = useCallback(() => {
    if (!userId) return;
    setFavorites([]);
    saveUserFavorites(userId, []);
  }, [userId]);

  return (
    <MovieContext.Provider value={{
      watchlist,
      favorites,
      isInWatchlist,
      addToWatchlist,
      removeFromWatchlist,
      toggleWatchlist,
      clearWatchlist,
      watchlistCount: watchlist.length,
      isFavorite,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      clearFavorites,
      favoritesCount: favorites.length,
      requestAuth,
      isAuthModalOpen: authModalConfig.isOpen,
      closeAuthModal
    }}>
      {children}
      <AuthRequiredModal
        isOpen={authModalConfig.isOpen}
        onClose={closeAuthModal}
        title={authModalConfig.title}
        message={authModalConfig.message}
      />
    </MovieContext.Provider>
  );
}

export function useMovieContext() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
}

// Aliases for clean component imports
export function useWatchlist() {
  const context = useMovieContext();
  return {
    watchlist: context.watchlist,
    isInWatchlist: context.isInWatchlist,
    addToWatchlist: context.addToWatchlist,
    removeFromWatchlist: context.removeFromWatchlist,
    toggleWatchlist: context.toggleWatchlist,
    clearWatchlist: context.clearWatchlist,
    totalCount: context.watchlistCount,
    watchlistCount: context.watchlistCount
  };
}

export function useFavorites() {
  const context = useMovieContext();
  return {
    favorites: context.favorites,
    isFavorite: context.isFavorite,
    addToFavorites: context.addToFavorites,
    removeFromFavorites: context.removeFromFavorites,
    toggleFavorite: context.toggleFavorite,
    clearFavorites: context.clearFavorites,
    favoritesCount: context.favoritesCount
  };
}
