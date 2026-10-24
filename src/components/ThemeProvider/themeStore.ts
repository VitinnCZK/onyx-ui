// External stores read with `useSyncExternalStore`, so the server and the hydration pass render
// with the server snapshot and the client switches to the real value right after.

const darkQuery = '(prefers-color-scheme: dark)';

const canMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function';

export function subscribeToSystemTheme(onChange: () => void): () => void {
  if (!canMatchMedia()) return () => {};

  const query = window.matchMedia(darkQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export const getSystemPrefersDark = () => canMatchMedia() && window.matchMedia(darkQuery).matches;

export const getServerSystemPrefersDark = () => false;

/**
 * Values that could not be written to `localStorage` (blocked storage, quota, private mode).
 * They keep the choice for the rest of the session even though it won't survive a reload.
 */
const unsaved = new Map<string, string>();
const listeners = new Set<() => void>();

export function readStoredTheme(key: string): string | null {
  if (unsaved.has(key)) return unsaved.get(key)!;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStoredTheme(key: string, theme: string): void {
  try {
    window.localStorage.setItem(key, theme);
    unsaved.delete(key);
  } catch {
    unsaved.set(key, theme);
  }
  listeners.forEach((listener) => listener());
}

/** Notifies on writes from this page and, through the `storage` event, from other tabs. */
export function subscribeToStoredTheme(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null) unsaved.clear();
    else unsaved.delete(event.key);
    onChange();
  };

  listeners.add(onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

export const getServerStoredTheme = () => null;
