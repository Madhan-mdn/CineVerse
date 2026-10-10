/**
 * Form Validation Utilities for CineVerse
 * Regex validation patterns and message helpers matching application requirements.
 */

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,}$/;
export const NAME_REGEX = /^[A-Za-z][A-Za-z ]{2,49}$/;

/**
 * Validates full name.
 * Must start with a letter, contain 3-50 letters/spaces.
 */
export function validateFullName(name) {
  if (!name || typeof name !== 'string') {
    return 'Full name is required.';
  }
  const trimmed = name.trim();
  if (trimmed.length < 3) {
    return 'Name must be at least 3 characters long.';
  }
  if (trimmed.length > 50) {
    return 'Name cannot exceed 50 characters.';
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'Name must start with a letter and contain only letters and spaces.';
  }
  return null;
}

/**
 * Validates email address format.
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Email address is required.';
  }
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }
  return null;
}

/**
 * Validates password complexity.
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter (a-z).';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter (A-Z).';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number (0-9).';
  }
  if (!/(?=.*[^A-Za-z\d\s])/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*).';
  }
  if (!PASSWORD_REGEX.test(password)) {
    return 'Password does not meet the complexity requirements.';
  }
  return null;
}

/**
 * Validates confirm password matches password.
 */
export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}
