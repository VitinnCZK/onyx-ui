import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { ThemeName } from '@/tokens';
import {
  getServerStoredTheme,
  getServerSystemPrefersDark,
  getSystemPrefersDark,
  readStoredTheme,
  subscribeToStoredTheme,
  subscribeToSystemTheme,
  writeStoredTheme,
} from './themeStore';

/** A built-in theme or the name of a custom `[data-theme='<name>']` block. */
export type ResolvedTheme = ThemeName | (string & Record<never, never>);

/** A theme, or `system` to follow the operating system's `prefers-color-scheme`. */
export type Theme = 'system' | ResolvedTheme;

export interface ThemeProviderProps {
  /**
   * Theme used until the user picks one with `setTheme`.
   * @default 'system'
   */
  defaultTheme?: Theme;
  /**
   * `localStorage` key that persists the user's choice.
   * @default 'vui-theme'
   */
  storageKey?: string;
  children?: ReactNode;
}

export interface ThemeContextValue {
  /** The chosen theme, `system` included. */
  theme: Theme;
  /** The theme applied to the page: `system` resolved to `light` or `dark`. */
  resolvedTheme: ResolvedTheme;
  /** Switches theme and persists the choice. */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Applies a theme to the page by setting `data-theme` on `<html>`, follows the system preference
 * in `system` mode and remembers the user's choice in `localStorage`.
 *
 * @example
 * <ThemeProvider defaultTheme="system">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
  defaultTheme = 'system',
  storageKey = 'vui-theme',
  children,
}: ThemeProviderProps) {
  const storedTheme = useSyncExternalStore(
    subscribeToStoredTheme,
    () => readStoredTheme(storageKey),
    getServerStoredTheme,
  );
  const prefersDark = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemPrefersDark,
    getServerSystemPrefersDark,
  );

  const theme = storedTheme || defaultTheme;
  const resolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;

  // Layout effect, so the theme is in place before the first paint.
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', resolvedTheme);

    return () => {
      if (previous === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', previous);
    };
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => writeStoredTheme(storageKey, next), [storageKey]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Reads and changes the current theme. Must be called inside a `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside a <ThemeProvider>.');
  return context;
}
