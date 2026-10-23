import { configureAxe } from 'vitest-axe';

/**
 * axe instance for unit tests. jsdom has no layout or canvas, so color contrast
 * is checked in Storybook (real browser) instead of here.
 */
export const axe = configureAxe({
  rules: {
    'color-contrast': { enabled: false },
  },
});
