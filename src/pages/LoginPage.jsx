import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Film, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const isValidInternalRedirect = rawRedirect && 
    rawRedirect.startsWith('/') && 
    !rawRedirect.startsWith('//') && 
    !rawRedirect.startsWith('/login') && 
    !rawRedirect.startsWith('/register');
  const redirectTarget = isValidInternalRedirect ? rawRedirect : '/explore';
  
  const { login, isAuthenticated } = useAuth();

  // If already authenticated, redirect away
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    searchParams.get('registered') ? 'Account created successfully! You can now log in.' : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        email: formData.email,
        password: formData.password
      });
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setGeneralError(err.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-9 h-9 rounded-lg bg-cine-accent text-white flex items-center justify-center font-brand font-bold text-lg shadow-subtle group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-brand font-bold text-2xl tracking-wider text-white">
              CINEVERSE
            </span>
          </Link>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-cine-muted mt-1.5">
            Log in to manage your watchlist, save favorites, and explore films.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-2xl border border-surface-border p-6 sm:p-8 shadow-card">
          
          {/* General Success Notice */}
          {successMessage && (
            <div className="mb-5 p-3.5 bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs flex items-start gap-2.5" role="status">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* General Error Notice */}
          {generalError && (
            <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-800/60 text-rose-300 rounded-xl text-xs flex items-start gap-2.5" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Email Field */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className={`w-full bg-canvas border rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    errors.email 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : 'border-surface-border focus:border-cine-accent'
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  className={`w-full bg-canvas border rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    errors.password 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : 'border-surface-border focus:border-cine-accent'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-cine-accent hover:bg-cine-accent-hover text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-subtle disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-cine-muted">
            Don't have an account yet?{' '}
            <Link 
              to={redirectTarget !== '/explore' ? `/register?redirect=${encodeURIComponent(redirectTarget)}` : '/register'} 
              className="font-semibold text-white hover:text-cine-accent transition-colors"
            >
              Create an account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
