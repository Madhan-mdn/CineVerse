import { useState, useEffect } from 'react';
import { getStorage, setStorage } from '../utils/storage';

/**
 * Custom React hook for persisting state in browser localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    return getStorage(key, initialValue);
  });

  useEffect(() => {
    setStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
