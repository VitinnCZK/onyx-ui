import type { baseColors, PaletteColor, PaletteStep } from './colors';

const ref = (color: PaletteColor | keyof typeof baseColors, step?: PaletteStep) =>
  step === undefined ? `var(--color-${color})` : `var(--color-${color}-${step})`;

/**
 * Semantic colors, exposed as `--color-<name>`. Components only use these, never the palette,
 * so a theme only has to redefine this layer.
 *
 * Each intent (`primary`, `success`, `warning`, `danger`, `info`) has:
 * - `<intent>`: solid fill, with `-hover` and `-active` states
 * - `on-<intent>`: text and icons on the solid fill
 * - `<intent>-subtle`: tinted background (alerts, badges)
 * - `<intent>-text`: intent-colored text on any background, subtle included
 * - `<intent>-border`: decorative border on the subtle background
 */
export const semanticColors = {
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

export type SemanticColor = keyof typeof semanticColors;
