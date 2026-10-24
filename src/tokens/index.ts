import { breakpoints } from './breakpoints';
import { baseColors, palette } from './colors';
import { focusRing } from './focus';
import { duration, easing, reducedMotionDuration } from './motion';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { themes, type ThemeName } from './themes';
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography';
import { zIndex } from './z-index';

export * from './breakpoints';
export * from './colors';
export * from './focus';
export * from './motion';
export * from './radius';
export * from './shadows';
export * from './spacing';
export * from './themes';
export * from './typography';
export * from './z-index';

export type CssVariable = `--${string}`;

const prefixed = (prefix: string, values: Record<string | number, string>) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [`--${prefix}-${key}`, value]),
  ) as Record<CssVariable, string>;

/**
 * Every theme-independent token as `custom property name → value`, declared on `:root` by the
 * `.css` files next to this one. `tokens.test.ts` keeps the two in sync.
 */
export const cssVariables: Record<CssVariable, string> = {
  ...prefixed('color', baseColors),
  ...Object.assign(
    {},
    ...Object.entries(palette).map(([color, scale]) => prefixed(`color-${color}`, scale)),
  ),
  ...prefixed('font-family', fontFamily),
  ...prefixed('font-size', fontSize),
  ...prefixed('font-weight', fontWeight),
  ...prefixed('line-height', lineHeight),
  ...prefixed('letter-spacing', letterSpacing),
  ...prefixed('space', spacing),
  ...prefixed('radius', radius),
  ...prefixed('shadow', shadows),
  ...prefixed('duration', duration),
  ...prefixed('easing', easing),
  ...prefixed('z-index', zIndex),
  ...prefixed('breakpoint', breakpoints),
  ...prefixed('focus-ring', focusRing),
};

/** Variables each theme declares in its `[data-theme='<name>']` block. */
export const themeVariables = Object.fromEntries(
  Object.entries(themes).map(([name, theme]): [string, Record<CssVariable, string>] => [
    name,
    { ...prefixed('color', theme.colors), '--shadow-color': theme.shadowColor },
  ]),
) as Record<ThemeName, Record<CssVariable, string>>;

/** Overrides applied under `@media (prefers-reduced-motion: reduce)`. */
export const reducedMotionVariables = prefixed(
  'duration',
  Object.fromEntries(Object.keys(duration).map((key) => [key, reducedMotionDuration])),
);
