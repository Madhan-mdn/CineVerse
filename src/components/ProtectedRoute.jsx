import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3" aria-live="polite">
        <div className="w-9 h-9 rounded-lg bg-cine-accent text-white flex items-center justify-center font-brand font-bold text-base shadow-subtle animate-pulse">
          C
        </div>
        <div className="w-5 h-5 rounded-full border-2 border-surface-border border-t-cine-accent animate-spin" />
        <span className="text-xs font-medium text-cine-muted tracking-wider">Checking session status...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  return children;
}
