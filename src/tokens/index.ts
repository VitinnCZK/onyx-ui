import { breakpoints } from './breakpoints';
import { baseColors, palette } from './colors';
import { duration, easing } from './motion';
import { radius } from './radius';
import { semanticColors } from './semantic-colors';
import { shadowColor, shadows } from './shadows';
import { spacing } from './spacing';
import { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight } from './typography';
import { zIndex } from './z-index';

export * from './breakpoints';
export * from './colors';
export * from './motion';
export * from './radius';
export * from './semantic-colors';
export * from './shadows';
export * from './spacing';
export * from './typography';
export * from './z-index';

export type CssVariable = `--${string}`;

const prefixed = (prefix: string, values: Record<string | number, string>) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [`--${prefix}-${key}`, value]),
  ) as Record<CssVariable, string>;

/**
 * Every token as `custom property name → value`. The `.css` files next to this one declare
 * exactly these variables, which `tokens.test.ts` enforces.
 */
export const cssVariables: Record<CssVariable, string> = {
  ...prefixed('color', baseColors),
  ...Object.assign(
    {},
    ...Object.entries(palette).map(([color, scale]) => prefixed(`color-${color}`, scale)),
  ),
  ...prefixed('color', semanticColors),
  ...prefixed('font-family', fontFamily),
  ...prefixed('font-size', fontSize),
  ...prefixed('font-weight', fontWeight),
  ...prefixed('line-height', lineHeight),
  ...prefixed('letter-spacing', letterSpacing),
  ...prefixed('space', spacing),
  ...prefixed('radius', radius),
  '--shadow-color': shadowColor,
  ...prefixed('shadow', shadows),
  ...prefixed('duration', duration),
  ...prefixed('easing', easing),
  ...prefixed('z-index', zIndex),
  ...prefixed('breakpoint', breakpoints),
};
