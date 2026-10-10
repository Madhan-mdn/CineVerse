import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, User, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  validateFullName, 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword 
} from '../utils/validation';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawRedirect = searchParams.get('redirect');
  const isValidInternalRedirect = rawRedirect && 
    rawRedirect.startsWith('/') && 
    !rawRedirect.startsWith('//') && 
    !rawRedirect.startsWith('/login') && 
    !rawRedirect.startsWith('/register');
  const redirectTarget = isValidInternalRedirect ? rawRedirect : '';

  const { register, isAuthenticated } = useAuth();

  // If already authenticated, redirect to destination or explore
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget || '/explore', { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTarget]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
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

    const nameErr = validateFullName(formData.name);
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    const confirmErr = validateConfirmPassword(formData.password, formData.confirmPassword);
    if (confirmErr) newErrors.confirmPassword = confirmErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      // Redirect to login page with success notification and preserved redirect
      const loginUrl = redirectTarget 
        ? `/login?registered=true&redirect=${encodeURIComponent(redirectTarget)}` 
        : '/login?registered=true';
      navigate(loginUrl, { replace: true });
    } catch (err) {
      setGeneralError(err.message || 'Registration failed. Please check your information.');
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
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-cine-muted mt-1.5">
            Join CineVerse to save your favorite movies and track your watchlist.
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface rounded-2xl border border-surface-border p-6 sm:p-8 shadow-card">
          
          {generalError && (
            <div className="mb-5 p-3.5 bg-rose-950/50 border border-rose-800/60 text-rose-300 rounded-xl text-xs flex items-start gap-2.5" role="alert">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* Full Name */}
            <div>
              <label htmlFor="register-name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Christopher Nolan"
                  disabled={isSubmitting}
                  className={`w-full bg-canvas border rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    errors.name 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : 'border-surface-border focus:border-cine-accent'
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.name && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="register-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="register-email"
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

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 chars, 1 uppercase, 1 symbol"
                  disabled={isSubmitting}
                  className={`w-full bg-canvas border rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    errors.password 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : 'border-surface-border focus:border-cine-accent'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  disabled={isSubmitting}
                  className={`w-full bg-canvas border rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition-colors ${
                    errors.confirmPassword 
                      ? 'border-rose-500 focus:border-rose-500' 
                      : 'border-surface-border focus:border-cine-accent'
                  }`}
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                  aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                  title={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.confirmPassword}</span>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-surface-border text-center text-xs text-cine-muted">
            Already have an account?{' '}
            <Link 
              to={redirectTarget ? `/login?redirect=${encodeURIComponent(redirectTarget)}` : '/login'} 
              className="font-semibold text-white hover:text-cine-accent transition-colors"
            >
              Sign In
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
