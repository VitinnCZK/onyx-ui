import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider, useTheme, type ThemeProviderProps } from '.';

/** Controllable `prefers-color-scheme` (jsdom has no `matchMedia`). */
function mockSystemTheme(initial: 'light' | 'dark') {
  let dark = initial === 'dark';
  const listeners = new Set<() => void>();

  window.matchMedia = vi.fn((media: string) => ({
    media,
    get matches() {
      return dark;
    },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  })) as unknown as typeof window.matchMedia;

  return {
    change(theme: 'light' | 'dark') {
      dark = theme === 'dark';
      act(() => listeners.forEach((listener) => listener()));
    },
  };
}

function ThemeState() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <>
      <output aria-label="theme">{theme}</output>
      <output aria-label="resolved theme">{resolvedTheme}</output>
      <button type="button" onClick={() => setTheme('dark')}>
        Dark
      </button>
      <button type="button" onClick={() => setTheme('system')}>
        System
      </button>
    </>
  );
}

const renderTheme = (props?: ThemeProviderProps) =>
  render(
    <ThemeProvider {...props}>
      <ThemeState />
    </ThemeProvider>,
  );

const appliedTheme = () => document.documentElement.getAttribute('data-theme');
const shown = (label: string) => screen.getByLabelText(label).textContent;

describe('ThemeProvider', () => {
  let system: ReturnType<typeof mockSystemTheme>;

  beforeEach(() => {
    system = mockSystemTheme('light');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('follows the system preference by default', () => {
    system = mockSystemTheme('dark');
    renderTheme();

    expect(shown('theme')).toBe('system');
    expect(shown('resolved theme')).toBe('dark');
    expect(appliedTheme()).toBe('dark');
  });

  it('reacts when the system preference changes', () => {
    renderTheme();
    expect(appliedTheme()).toBe('light');

    system.change('dark');

    expect(appliedTheme()).toBe('dark');
    expect(shown('resolved theme')).toBe('dark');
  });

  it('uses defaultTheme until the user picks a theme', () => {
    system = mockSystemTheme('dark');
    renderTheme({ defaultTheme: 'light' });

    expect(shown('theme')).toBe('light');
    expect(appliedTheme()).toBe('light');
  });

  it('applies custom theme names as they are', () => {
    renderTheme({ defaultTheme: 'brand' });

    expect(shown('resolved theme')).toBe('brand');
    expect(appliedTheme()).toBe('brand');
  });

  it('switches theme and persists the choice under storageKey', async () => {
    renderTheme({ storageKey: 'app-theme' });

    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));

    expect(shown('theme')).toBe('dark');
    expect(appliedTheme()).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('restores the persisted choice', () => {
    localStorage.setItem('vui-theme', 'dark');
    renderTheme({ defaultTheme: 'light' });

    expect(shown('theme')).toBe('dark');
    expect(appliedTheme()).toBe('dark');
  });

  it('persists system as a choice of its own', async () => {
    localStorage.setItem('vui-theme', 'dark');
    renderTheme();

    await userEvent.click(screen.getByRole('button', { name: 'System' }));

    expect(localStorage.getItem('vui-theme')).toBe('system');
    expect(appliedTheme()).toBe('light');
  });

  it('keeps working when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    renderTheme({ storageKey: 'blocked-theme' });

    await userEvent.click(screen.getByRole('button', { name: 'Dark' }));

    expect(appliedTheme()).toBe('dark');
  });

  it('follows changes made in other tabs', () => {
    renderTheme();

    act(() => {
      localStorage.setItem('vui-theme', 'dark');
      window.dispatchEvent(new StorageEvent('storage', { key: 'vui-theme', newValue: 'dark' }));
    });

    expect(appliedTheme()).toBe('dark');
  });

  it('restores the previous data-theme when unmounted', () => {
    document.documentElement.setAttribute('data-theme', 'brand');
    const { unmount } = renderTheme({ defaultTheme: 'dark' });
    expect(appliedTheme()).toBe('dark');

    unmount();

    expect(appliedTheme()).toBe('brand');
  });

  it('renders on the server with defaultTheme, without touching the document', () => {
    localStorage.setItem('vui-theme', 'light');

    const html = renderToString(
      <ThemeProvider defaultTheme="dark">
        <ThemeState />
      </ThemeProvider>,
    );

    expect(html).toContain('>dark</output>');
    expect(appliedTheme()).toBeNull();
  });
});

describe('useTheme', () => {
  it('throws outside a ThemeProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<ThemeState />)).toThrow(/inside a <ThemeProvider>/);
  });
});
