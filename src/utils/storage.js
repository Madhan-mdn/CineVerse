/**
 * Safe browser localStorage utility with error handling and fallback defaults.
 */

export function getStorage(key, defaultValue = null) {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null || item === undefined) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error saving to localStorage key "${key}":`, error);
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
}
