/**
 * Authentication Storage Utility for CineVerse (Frontend Demo Auth)
 *
 * NOTE: For this frontend-only learning project, authentication is handled via browser localStorage.
 * While passwords are salted and hashed with SHA-256 before storing to avoid plaintext exposure,
 * client-side localStorage is inherently accessible via browser developer tools and is intended
 * exclusively for demonstration and portfolio testing rather than production security.
 */

const STORAGE_KEYS = {
  USERS: 'movieAppUsers',
  SESSION: 'movieAppSession'
};

/**
 * Hash a password using Web Crypto API SHA-256 with application salt
 * Avoids storing plaintext passwords in localStorage
 */
export async function hashPassword(password) {
  if (!password) return '';
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + '_cineverse_demo_salt_2026');
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Web Crypto unavailable, falling back to alternative digest', e);
  }

  // Safe fallback digest if crypto.subtle is inaccessible
  let hash = 0;
  const salted = password + '_cineverse_fallback_salt';
  for (let i = 0; i < salted.length; i++) {
    hash = (hash << 5) - hash + salted.charCodeAt(i);
    hash |= 0;
  }
  return 'sha_demo_' + Math.abs(hash).toString(16);
}

/**
 * Retrieve all registered demo users safely from localStorage
 * Returns Array of users or empty array
 */
export function getUsers() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse movieAppUsers from localStorage:', error);
    return [];
  }
}

/**
 * Retrieve the active user session from localStorage
 * Returns session object { id, name, email, loggedInAt } or null
 * Cleans up invalid, corrupted, or orphaned sessions immediately.
 */
export function getCurrentUser() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = window.localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return null;

    let session;
    try {
      session = JSON.parse(raw);
    } catch (parseError) {
      console.warn('Malformed movieAppSession in localStorage. Clearing invalid session.');
      window.localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }

    if (!session || typeof session !== 'object' || !session.id || !session.email) {
      console.warn('Incomplete movieAppSession in localStorage. Clearing invalid session.');
      window.localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }

    // Verify session belongs to an existing registered user in movieAppUsers
    const users = getUsers();
    const registeredUser = users.find(
      u => u.id === session.id && u.email.toLowerCase() === session.email.toLowerCase()
    );

    if (!registeredUser) {
      console.warn('Session references nonexistent or deregistered user. Clearing invalid session.');
      window.localStorage.removeItem(STORAGE_KEYS.SESSION);
      return null;
    }

    // Return sanitized session with up-to-date user name
    return {
      id: registeredUser.id,
      name: registeredUser.name || session.name,
      email: registeredUser.email,
      loggedInAt: session.loggedInAt || new Date().toISOString()
    };
  } catch (error) {
    console.warn('Unexpected error verifying session from localStorage:', error);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_KEYS.SESSION);
      }
    } catch (e) {
      // ignore
    }
    return null;
  }
}


/**
 * Register a new demo user
 * Checks for duplicates, hashes password, saves to movieAppUsers
 */
export async function registerUser({ name, email, password }) {
  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanName) {
    throw new Error('Please provide your full name.');
  }
  if (!cleanEmail) {
    throw new Error('Please provide your email address.');
  }
  if (!password) {
    throw new Error('Please provide a password.');
  }

  const users = getUsers();

  // Check for duplicate email
  const existingUser = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existingUser) {
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  const newUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: cleanName,
    email: cleanEmail,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  try {
    const updatedUsers = [...users, newUser];
    window.localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
    throw new Error('Failed to save account to browser storage. Please check storage permissions.');
  }

  // Return safe user object (no passwordHash)
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
}

/**
 * Authenticate an existing user
 * Verifies credentials, saves active session to movieAppSession
 */
export async function loginUser(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanEmail || !password) {
    throw new Error('Please enter both your email and password.');
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    throw new Error('No account found with this email address. Please register first.');
  }

  const inputHash = await hashPassword(password);

  if (user.passwordHash !== inputHash) {
    throw new Error('Incorrect password. Please verify your credentials.');
  }

  // Create active session without password fields
  const session = {
    id: user.id,
    name: user.name,
    email: user.email,
    loggedInAt: new Date().toISOString()
  };

  try {
    window.localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session to localStorage:', error);
  }

  return session;
}

/**
 * Logout the current user
 * Clears only movieAppSession, preserving watchlist, favorites, and user accounts
 */
export function logoutUser() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (error) {
    console.warn('Error clearing session from localStorage:', error);
  }
}
