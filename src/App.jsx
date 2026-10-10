import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MovieProvider } from './context/MovieContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExploreMoviesPage from './pages/ExploreMoviesPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import WatchlistPage from './pages/WatchlistPage';
import FavoritesPage from './pages/FavoritesPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <MovieProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-canvas text-cine-body">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* Authentication Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Movie Discovery & Exploration */}
                <Route path="/explore" element={<ExploreMoviesPage />} />
                <Route path="/discover" element={<Navigate to="/explore" replace />} />
                <Route path="/search" element={<ExploreMoviesPage />} />
                
                {/* Movie Details */}
                <Route path="/movie/:id" element={<MovieDetailsPage />} />
                
                {/* User Collections (Watchlist & Favorites) - Protected */}
                <Route
                  path="/watchlist"
                  element={
                    <ProtectedRoute>
                      <WatchlistPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Redirects & Aliases */}
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/recommendations" element={<Navigate to="/explore" replace />} />
                <Route path="/compare" element={<Navigate to="/explore" replace />} />
                <Route path="/analytics" element={<Navigate to="/" replace />} />
                <Route path="/universe" element={<Navigate to="/" replace />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Navigate to="/watchlist" replace />
                    </ProtectedRoute>
                  }
                />
                
                {/* Policy & Terms */}
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                
                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </MovieProvider>
      </AuthProvider>
    </Router>
  );
}
