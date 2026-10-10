/**
 * TMDB API Client
 * Official TMDB API integration for discovering movies, searching titles,
 * retrieving credits, trailers, and similar titles.
 * Gracefully handles offline mode and unconfigured API keys without crashing.
 */

import { MOVIES } from '../data/moviesData.js';

const TMDB_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env.VITE_TMDB_API_KEY 
  : (typeof process !== 'undefined' && process.env ? process.env.VITE_TMDB_API_KEY : '');

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Fallback poster when none is provided by TMDB
export const FALLBACK_POSTER = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20width%3D%22300%22%20height%3D%22450%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23111827%22%2F%3E%3Cpath%20d%3D%22M150%20170a45%2045%200%201%200%200%2090%2045%2045%200%200%200%200-90zm-60%20120h120v15H90z%22%20fill%3D%22%23374151%22%2F%3E%3Ctext%20x%3D%22150%22%20y%3D%22240%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%239CA3AF%22%20text-anchor%3D%22middle%22%3ENo%20Poster%20Available%3C%2Ftext%3E%3C%2Fsvg%3E';

// Check if TMDB API Key is configured with a real value
export function isApiConfigured() {
  return Boolean(
    TMDB_API_KEY &&
    TMDB_API_KEY.trim() !== '' &&
    TMDB_API_KEY !== 'your_api_key_here' &&
    TMDB_API_KEY !== 'your_tmdb_api_key_here'
  );
}

// Generate full TMDB image URL
export function getImageUrl(path, size = 'w500') {
  if (!path) return FALLBACK_POSTER;
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path, size = 'w1280') {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

// Standard TMDB Genres
export const TMDB_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

export const GENRE_MAP = TMDB_GENRES.reduce((acc, g) => {
  acc[g.id] = g.name;
  acc[g.name] = g.id;
  return acc;
}, {});

// Normalize any movie item (TMDB raw response or local catalog)
export function normalizeMovie(item, includeSimilar = true) {
  if (!item) return null;

  const id = item.id;
  const title = item.title || item.name || 'Untitled';
  const originalTitle = item.original_title || item.original_name || item.originalTitle || title;
  
  const releaseDate = item.release_date || item.first_air_date || item.releaseDate || '';
  let year = item.year;
  if (!year && releaseDate) {
    const parsed = new Date(releaseDate).getFullYear();
    if (!isNaN(parsed)) year = parsed;
  }

  const rawRating = typeof item.vote_average === 'number' ? item.vote_average : (typeof item.rating === 'number' ? item.rating : 0);
  const rating = Number(rawRating.toFixed(1));
  const voteCount = item.vote_count || item.voteCount || 0;

  const poster = item.poster_path ? getImageUrl(item.poster_path, 'w500') : (item.poster || FALLBACK_POSTER);
  const backdrop = item.backdrop_path ? getBackdropUrl(item.backdrop_path, 'w1280') : (item.backdrop || null);

  // Genre resolution
  let genres = [];
  if (Array.isArray(item.genres)) {
    genres = item.genres.map(g => (typeof g === 'object' ? g.name : g));
  } else if (Array.isArray(item.genre_ids)) {
    genres = item.genre_ids.map(gid => GENRE_MAP[gid]).filter(Boolean);
  }

  // Runtime formatted
  let runtime = null;
  if (typeof item.runtime === 'number' && item.runtime > 0) {
    const hours = Math.floor(item.runtime / 60);
    const mins = item.runtime % 60;
    runtime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  } else if (typeof item.runtime === 'string') {
    runtime = item.runtime;
  }

  // Videos / Trailer resolution
  let trailerId = item.trailerYoutubeId || item.trailerKey || null;
  if (item.videos?.results && Array.isArray(item.videos.results)) {
    const officialTrailer = item.videos.results.find(v => 
      v.site === 'YouTube' && v.type === 'Trailer'
    ) || item.videos.results.find(v => v.site === 'YouTube');
    if (officialTrailer) trailerId = officialTrailer.key;
  }

  // Cast members
  const cast = item.credits?.cast
    ? item.credits.cast.slice(0, 10).map(c => ({
        id: c.id,
        name: c.name,
        role: c.character || 'Actor',
        photo: c.profile_path ? getImageUrl(c.profile_path, 'w185') : null
      }))
    : (item.cast || []);

  // Director
  let director = item.director || '';
  if (item.credits?.crew && Array.isArray(item.credits.crew)) {
    const dir = item.credits.crew.find(c => c.job === 'Director');
    if (dir) director = dir.name;
  }

  // Similar movies
  let similar = [];
  if (includeSimilar) {
    if (item.similar?.results && Array.isArray(item.similar.results)) {
      similar = item.similar.results.slice(0, 8).map(m => normalizeMovie(m, false)).filter(Boolean);
    } else if (item.recommendations?.results && Array.isArray(item.recommendations.results)) {
      similar = item.recommendations.results.slice(0, 8).map(m => normalizeMovie(m, false)).filter(Boolean);
    } else if (Array.isArray(item.similarMovieIds)) {
      similar = MOVIES.filter(m => item.similarMovieIds.includes(m.id)).slice(0, 8).map(m => normalizeMovie(m, false));
    }
  }

  return {
    id,
    title,
    originalTitle,
    releaseDate,
    year,
    rating,
    voteCount,
    poster,
    backdrop,
    genres,
    overview: item.overview || 'No overview available for this movie.',
    runtime,
    tagline: item.tagline || '',
    budget: item.budget ? `$${Number(item.budget).toLocaleString()}` : null,
    revenue: item.revenue ? `$${Number(item.revenue).toLocaleString()}` : null,
    originalLanguage: item.original_language || item.originalLanguage || '',
    director,
    cast,
    trailerId,
    trailerYoutubeId: trailerId,
    similar
  };
}

// Internal fetcher with timeout and query building
async function tmdbFetch(endpoint, params = {}) {
  if (!isApiConfigured()) {
    throw new Error('TMDB_API_KEY_NOT_CONFIGURED');
  }

  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });

  const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB_API_ERROR_${response.status}`);
  }

  return await response.json();
}

/**
 * 1. Fetch Trending Movies
 */
export async function getTrendingMovies(page = 1, timeWindow = 'week') {
  try {
    const data = await tmdbFetch(`/trending/movie/${timeWindow}`, { page });
    return {
      movies: (data.results || []).map(normalizeMovie),
      page: data.page || 1,
      totalPages: Math.min(data.total_pages || 1, 500),
      totalResults: data.total_results || 0
    };
  } catch (err) {
    const local = MOVIES.slice((page - 1) * 20, page * 20);
    return {
      movies: local.map(m => normalizeMovie(m)),
      page,
      totalPages: Math.max(1, Math.ceil(MOVIES.length / 20)),
      totalResults: MOVIES.length,
      isFallback: true
    };
  }
}

/**
 * 2. Fetch Popular Movies
 */
export async function getPopularMovies(page = 1) {
  try {
    const data = await tmdbFetch('/movie/popular', { page });
    return {
      movies: (data.results || []).map(normalizeMovie),
      page: data.page || 1,
      totalPages: Math.min(data.total_pages || 1, 500),
      totalResults: data.total_results || 0
    };
  } catch (err) {
    const sorted = [...MOVIES].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const local = sorted.slice((page - 1) * 20, page * 20);
    return {
      movies: local.map(m => normalizeMovie(m)),
      page,
      totalPages: Math.max(1, Math.ceil(sorted.length / 20)),
      totalResults: sorted.length,
      isFallback: true
    };
  }
}

/**
 * 3. Fetch Top Rated Movies
 */
export async function getTopRatedMovies(page = 1) {
  try {
    const data = await tmdbFetch('/movie/top_rated', { page });
    return {
      movies: (data.results || []).map(normalizeMovie),
      page: data.page || 1,
      totalPages: Math.min(data.total_pages || 1, 500),
      totalResults: data.total_results || 0
    };
  } catch (err) {
    const sorted = [...MOVIES].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    const local = sorted.slice((page - 1) * 20, page * 20);
    return {
      movies: local.map(m => normalizeMovie(m)),
      page,
      totalPages: Math.max(1, Math.ceil(sorted.length / 20)),
      totalResults: sorted.length,
      isFallback: true
    };
  }
}

/**
 * 4. Fetch Upcoming Movies
 */
export async function getUpcomingMovies(page = 1) {
  try {
    const data = await tmdbFetch('/movie/upcoming', { page });
    return {
      movies: (data.results || []).map(normalizeMovie),
      page: data.page || 1,
      totalPages: Math.min(data.total_pages || 1, 500),
      totalResults: data.total_results || 0
    };
  } catch (err) {
    const local = MOVIES.filter(m => (m.year || 0) >= 2024).slice((page - 1) * 20, page * 20);
    return {
      movies: local.map(m => normalizeMovie(m)),
      page,
      totalPages: Math.max(1, Math.ceil(MOVIES.length / 20)),
      totalResults: MOVIES.length,
      isFallback: true
    };
  }
}

/**
 * 5. Search Movies by title
 */
export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) {
    return { movies: [], page: 1, totalPages: 1, totalResults: 0 };
  }

  try {
    const data = await tmdbFetch('/search/movie', {
      query: query.trim(),
      page,
      include_adult: false
    });
    return {
      movies: (data.results || []).map(normalizeMovie),
      page: data.page || 1,
      totalPages: Math.min(data.total_pages || 1, 500),
      totalResults: data.total_results || 0
    };
  } catch (err) {
    const q = query.toLowerCase().trim();
    const local = MOVIES.filter(m => 
      m.title.toLowerCase().includes(q) || 
      (m.overview && m.overview.toLowerCase().includes(q)) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      (Array.isArray(m.genres) && m.genres.some(g => g.toLowerCase().includes(q)))
    );
    return {
      movies: local.slice((page - 1) * 20, page * 20).map(m => normalizeMovie(m)),
      page,
      totalPages: Math.max(1, Math.ceil(local.length / 20)),
      totalResults: local.length,
      isFallback: true
    };
  }
}

/**
 * 6. Discover Movies by general filters (Genre, Release Year, Minimum Rating, Sort By)
 */
export async function discoverMovies({
  genre = 'All Genres',
  year = 'Any Year',
  rating = 'Any Rating',
  sortBy = 'popularity.desc',
  page = 1
}) {
  try {
    const params = {
      page,
      sort_by: sortBy,
      include_adult: false
    };

    // Genre filter
    if (genre && genre !== 'All Genres') {
      const genreId = GENRE_MAP[genre];
      if (genreId) {
        params.with_genres = genreId;
      }
    }

    // Release Year filter
    if (year && year !== 'Any Year') {
      if (/^\d{4}$/.test(year)) {
        params.primary_release_year = parseInt(year, 10);
      } else if (year === '2020–2024' || year === '2020-2024') {
        params['primary_release_date.gte'] = '2020-01-01';
        params['primary_release_date.lte'] = '2024-12-31';
      } else if (year === '2010s') {
        params['primary_release_date.gte'] = '2010-01-01';
        params['primary_release_date.lte'] = '2019-12-31';
      } else if (year === '2000s') {
        params['primary_release_date.gte'] = '2000-01-01';
        params['primary_release_date.lte'] = '2009-12-31';
      } else if (year === '1990s') {
        params['primary_release_date.gte'] = '1990-01-01';
        params['primary_release_date.lte'] = '1999-12-31';
      } else if (year === 'Classic') {
        params['primary_release_date.lte'] = '1989-12-31';
      }
    }

    // Minimum Rating filter
    if (rating && rating !== 'Any Rating') {
      const minVal = parseFloat(rating.replace('+', ''));
      if (!isNaN(minVal)) {
        params['vote_average.gte'] = minVal;
        params['vote_count.gte'] = 20; // Filter out zero-vote anomalies
      }
    }

    // If sorting by rating, ensure sufficient vote sample
    if (sortBy === 'vote_average.desc') {
      params['vote_count.gte'] = Math.max(params['vote_count.gte'] || 0, 50);
    }

    const data = await tmdbFetch('/discover/movie', params);
    return {
      movies: (data.results || []).map(normalizeMovie),
      page: data.page || 1,
      totalPages: Math.min(data.total_pages || 1, 500),
      totalResults: data.total_results || 0
    };
  } catch (err) {
    // Local fallback catalog filtering
    let list = MOVIES.filter(m => {
      // Genre
      if (genre && genre !== 'All Genres') {
        if (!Array.isArray(m.genres) || !m.genres.some(g => g.toLowerCase() === genre.toLowerCase())) {
          return false;
        }
      }

      // Year
      if (year && year !== 'Any Year') {
        if (/^\d{4}$/.test(year)) {
          if (m.year !== parseInt(year, 10)) return false;
        } else if (year === '2020–2024' || year === '2020-2024') {
          if (m.year < 2020 || m.year > 2024) return false;
        } else if (year === '2010s') {
          if (m.year < 2010 || m.year > 2019) return false;
        } else if (year === '2000s') {
          if (m.year < 2000 || m.year > 2009) return false;
        } else if (year === '1990s') {
          if (m.year < 1990 || m.year > 1999) return false;
        } else if (year === 'Classic') {
          if (m.year > 1989) return false;
        }
      }

      // Rating
      if (rating && rating !== 'Any Rating') {
        const minVal = parseFloat(rating.replace('+', ''));
        if (!isNaN(minVal) && (m.rating || 0) < minVal) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'vote_average.desc') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'primary_release_date.desc') {
      list.sort((a, b) => (b.year || 0) - (a.year || 0));
    } else if (sortBy === 'primary_release_date.asc') {
      list.sort((a, b) => (a.year || 0) - (b.year || 0));
    } else {
      // Popularity default
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const pageItems = list.slice((page - 1) * 20, page * 20);
    return {
      movies: pageItems.map(m => normalizeMovie(m)),
      page,
      totalPages: Math.max(1, Math.ceil(list.length / 20)),
      totalResults: list.length,
      isFallback: true
    };
  }
}

/**
 * 7. Fetch Detailed Movie Information by ID
 * Includes credits, trailers, and similar movies
 */
export async function getMovieDetails(id) {
  if (!id) return null;

  try {
    const data = await tmdbFetch(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations'
    });
    return normalizeMovie(data);
  } catch (err) {
    const local = MOVIES.find(m => String(m.id) === String(id));
    if (local) {
      return normalizeMovie(local);
    }
    return null;
  }
}

// Available Filter Options for Explore Page
export const GENRE_OPTIONS = [
  'All Genres',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller',
  'War',
  'Western'
];

export const YEAR_OPTIONS = [
  'Any Year',
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2020–2024',
  '2010s',
  '2000s',
  '1990s',
  'Classic'
];

export const RATING_OPTIONS = [
  'Any Rating',
  '8+ Stars',
  '7+ Stars',
  '6+ Stars',
  '5+ Stars'
];

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest First' },
  { value: 'primary_release_date.asc', label: 'Oldest First' }
];
