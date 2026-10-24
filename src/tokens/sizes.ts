/** Fixed dimensions shared by components: icons, controls, touch targets and floating layers. */
export const sizes = {
  'icon-xs': '0.75rem',
  'icon-sm': '1rem',
  'icon-md': '1.25rem',
  'icon-lg': '1.5rem',
  'icon-xl': '2rem',
  'control-sm': '2rem',
  'control-md': '2.5rem',
  'control-lg': '3rem',
  /** Minimum size of a primary control on touch devices (WCAG 2.5.5). */
  'touch-target': '2.75rem',
  tooltip: '20rem',
  menu: '12rem',
  'overlay-sm': '24rem',
  'overlay-md': '32rem',
  'overlay-lg': '48rem',
} as const;

export const borderWidth = {
  thin: '1px',
  thick: '2px',
} as const;
