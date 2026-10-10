/**
 * Backward compatibility re-export of useWatchlist and WatchlistProvider.
 * Backed by localStorage through MovieContext.
 */
import React from 'react';
import { useWatchlist, MovieProvider } from './MovieContext';

export { useWatchlist };

export function WatchlistProvider({ children }) {
  return (
    <MovieProvider>
      {children}
    </MovieProvider>
  );
}

export default WatchlistProvider;
