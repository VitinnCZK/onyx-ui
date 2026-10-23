/**
 * Minimum viewport widths. CSS custom properties can't be read inside `@media`, so the
 * `--breakpoint-*` variables are for reference and JavaScript (`matchMedia`); media queries
 * have to repeat these values.
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
