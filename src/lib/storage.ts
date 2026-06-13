import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const PREFIX = 'nata-connect:';

export function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(`${PREFIX}${key}`);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function usePersistentState<T>(key: string, fallback: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => readStoredValue(key, fallback));

  useEffect(() => {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function exportAppData() {
  const data = Object.fromEntries(
    Object.keys(localStorage)
      .filter(key => key.startsWith(PREFIX))
      .map(key => [key.slice(PREFIX.length), JSON.parse(localStorage.getItem(key) || 'null')]),
  );
  return JSON.stringify({ exportedAt: new Date().toISOString(), data }, null, 2);
}

export function clearAppData() {
  Object.keys(localStorage)
    .filter(key => key.startsWith(PREFIX))
    .forEach(key => localStorage.removeItem(key));
}
