# CineVerse Application Screenshots

This directory contains genuine desktop screenshots (`1440 × 1000` viewport) captured directly from the running **CineVerse** React + Vite application powered by the TMDB API and browser `localStorage` persistence.

## Screenshot Index

1. **[`01-landing-page.png`](./01-landing-page.png) — Public Landing Page**
   - Displays the public landing hero banner, platform statistics, call-to-action buttons, and live **Trending This Week** movie shelf fetched from TMDB.
2. **[`02-login-page.png`](./02-login-page.png) — Login Page & Validation UI**
   - Shows the authentication sign-in card (`/login`), email and password inputs with visibility toggle, and real-time regex validation feedback using synthetic demo input.
3. **[`03-register-page.png`](./03-register-page.png) — Registration Page**
   - Shows the account creation form (`/register`) with full name, email address, password, and password confirmation fields alongside complexity guidance.
4. **[`04-movie-discovery.png`](./04-movie-discovery.png) — Movie Discovery & Filters**
   - Displays the catalog discovery experience (`/explore`) with live TMDB movie posters, title search bar, four filter controls (Genre, Release Year, Minimum Rating, and Sort By), and authenticated navigation badges.
5. **[`05-movie-details.png`](./05-movie-details.png) — Movie Details Page**
   - Shows a movie detail view (`/movie/:id`) featuring the theatrical poster, watchlist/favorites/trailer action buttons, release metadata, rating score, genre tags, overview, director, and top cast.
6. **[`06-watchlist.png`](./06-watchlist.png) — User Watchlist (Populated State)**
   - Displays the protected **My Watchlist** page (`/watchlist`) populated with saved movies for a synthetic demo account (`Alex Mercer`), including search-within-list, sort controls, and collection switcher tabs.
7. **[`07-favorites.png`](./07-favorites.png) — User Favorites (Populated State)**
   - Displays the protected **Favorites** page (`/favorites`) populated with curated favorite films for the demo user, along with local filtering, sorting, and collection management controls.
8. **[`08-auth-required.png`](./08-auth-required.png) — Authentication Required Modal**
   - Shows the **Sign In Required** modal (`AuthRequiredModal`) triggered when an unauthenticated visitor attempts to save a movie to their Watchlist or Favorites, offering direct navigation to Login or Register with return-path preservation.

## Notes & Limitations

- All eight target pages and states were captured without errors using live TMDB catalog data and a synthetic demo account (`alex.mercer@cineverse.demo`). No private credentials or personal information are included.
