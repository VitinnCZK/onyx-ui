import type { baseColors, PaletteColor, PaletteStep } from './colors';

const ref = (color: PaletteColor | keyof typeof baseColors, step?: PaletteStep) =>
  step === undefined ? `var(--color-${color})` : `var(--color-${color}-${step})`;

/**
 * Semantic colors of the light theme (the default), exposed as `--color-<name>`. Components
 * only use these, never the palette, so a theme only has to redefine this layer.
 *
 * Each intent (`primary`, `success`, `warning`, `danger`, `info`) has:
 * - `<intent>`: solid fill, with `-hover` and `-active` states
 * - `on-<intent>`: text and icons on the solid fill
 * - `<intent>-subtle`: tinted background (alerts, badges)
 * - `<intent>-text`: intent-colored text on any background, subtle included
 * - `<intent>-border`: decorative border on the subtle background
 */
export const lightColors = {
  bg: ref('white'),
  'bg-subtle': ref('neutral', 50),
  'bg-muted': ref('neutral', 100),
  'bg-inverse': ref('neutral', 900),
  surface: ref('white'),
  'surface-raised': ref('white'),
  backdrop: `color-mix(in srgb, ${ref('neutral', 900)} 50%, transparent)`,

  text: ref('neutral', 900),
  'text-muted': ref('neutral', 600),
  'text-disabled': ref('neutral', 400),
  'text-inverse': ref('white'),

  /** Decorative borders: dividers, card outlines. */
  border: ref('neutral', 200),
  /** Borders that identify a control (inputs, checkboxes); must reach 3:1. */
  'border-strong': ref('neutral', 500),
  focus: ref('primary', 600),

  primary: ref('primary', 600),
  'primary-hover': ref('primary', 700),
  'primary-active': ref('primary', 800),
  'on-primary': ref('white'),
  'primary-subtle': ref('primary', 50),
  'primary-text': ref('primary', 700),
  'primary-border': ref('primary', 200),

  success: ref('success', 700),
  'success-hover': ref('success', 800),
  'success-active': ref('success', 900),
  'on-success': ref('white'),
  'success-subtle': ref('success', 50),
  'success-text': ref('success', 800),
  'success-border': ref('success', 200),

  warning: ref('warning', 700),
  'warning-hover': ref('warning', 800),
  'warning-active': ref('warning', 900),
  'on-warning': ref('white'),
  'warning-subtle': ref('warning', 50),
  'warning-text': ref('warning', 800),
  'warning-border': ref('warning', 200),

  danger: ref('danger', 600),
  'danger-hover': ref('danger', 700),
  'danger-active': ref('danger', 800),
  'on-danger': ref('white'),
  'danger-subtle': ref('danger', 50),
  'danger-text': ref('danger', 700),
  'danger-border': ref('danger', 200),

  info: ref('info', 700),
  'info-hover': ref('info', 800),
  'info-active': ref('info', 900),
  'on-info': ref('white'),
  'info-subtle': ref('info', 50),
  'info-text': ref('info', 800),
  'info-border': ref('info', 200),
} as const;

export type SemanticColor = keyof typeof lightColors;

/**
 * Semantic colors of the dark theme. Solid fills use the light end of each scale with dark
 * text on top, and hover/active get lighter instead of darker.
 */
export const darkColors = {
  bg: ref('neutral', 900),
  'bg-subtle': ref('neutral', 800),
  'bg-muted': ref('neutral', 700),
  'bg-inverse': ref('neutral', 50),
  surface: ref('neutral', 900),
  'surface-raised': ref('neutral', 800),
  backdrop: `color-mix(in srgb, ${ref('black')} 60%, transparent)`,

  text: ref('neutral', 50),
  'text-muted': ref('neutral', 300),
  'text-disabled': ref('neutral', 500),
  'text-inverse': ref('neutral', 900),

  border: ref('neutral', 700),
  'border-strong': ref('neutral', 400),
  focus: ref('primary', 300),

  primary: ref('primary', 400),
  'primary-hover': ref('primary', 300),
  'primary-active': ref('primary', 200),
  'on-primary': ref('neutral', 900),
  'primary-subtle': ref('primary', 900),
  'primary-text': ref('primary', 300),
  'primary-border': ref('primary', 700),

  success: ref('success', 400),
  'success-hover': ref('success', 300),
  'success-active': ref('success', 200),
  'on-success': ref('neutral', 900),
  'success-subtle': ref('success', 900),
  'success-text': ref('success', 300),
  'success-border': ref('success', 700),

  warning: ref('warning', 400),
  'warning-hover': ref('warning', 300),
  'warning-active': ref('warning', 200),
  'on-warning': ref('neutral', 900),
  'warning-subtle': ref('warning', 900),
  'warning-text': ref('warning', 300),
  'warning-border': ref('warning', 700),

  danger: ref('danger', 400),
  'danger-hover': ref('danger', 300),
  'danger-active': ref('danger', 200),
  'on-danger': ref('neutral', 900),
  'danger-subtle': ref('danger', 900),
  'danger-text': ref('danger', 300),
  'danger-border': ref('danger', 700),

  info: ref('info', 400),
  'info-hover': ref('info', 300),
  'info-active': ref('info', 200),
  'on-info': ref('neutral', 900),
  'info-subtle': ref('info', 900),
  'info-text': ref('info', 300),
  'info-border': ref('info', 700),
} as const satisfies Record<SemanticColor, string>;

export interface ThemeTokens {
  /** Value of the CSS `color-scheme` property: native controls and scrollbars follow it. */
  colorScheme: 'light' | 'dark';
  colors: Record<SemanticColor, string>;
  /** RGB channels used by every `--shadow-*` token. */
  shadowColor: string;
}

/**
 * Built-in themes. Each one is a `[data-theme='<name>']` block in `src/styles/themes/`;
 * light is also the default on `:root`.
 */
export const themes = {
  light: { colorScheme: 'light', colors: lightColors, shadowColor: '24 24 27' },
  dark: { colorScheme: 'dark', colors: darkColors, shadowColor: '0 0 0' },
} as const satisfies Record<string, ThemeTokens>;

export type ThemeName = keyof typeof themes;
