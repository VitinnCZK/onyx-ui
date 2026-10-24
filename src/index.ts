import './styles/index.css';

export { Portal } from './components/Portal';
export type { PortalProps } from './components/Portal';
export { ThemeProvider, useTheme } from './components/ThemeProvider';
export type {
  ResolvedTheme,
  Theme,
  ThemeContextValue,
  ThemeProviderProps,
} from './components/ThemeProvider';
export { VisuallyHidden } from './components/VisuallyHidden';
export type { VisuallyHiddenProps } from './components/VisuallyHidden';
export { useClickOutside, useControllableState, useEscapeKey, useFocusTrap } from './hooks';
export type {
  UseClickOutsideOptions,
  UseControllableStateProps,
  UseEscapeKeyOptions,
  UseFocusTrapOptions,
} from './hooks';
export {
  baseColors,
  breakpoints,
  cssVariables,
  darkColors,
  duration,
  easing,
  focusRing,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lightColors,
  lineHeight,
  palette,
  paletteSteps,
  radius,
  reducedMotionDuration,
  reducedMotionVariables,
  shadows,
  spacing,
  themes,
  themeVariables,
  zIndex,
} from './tokens';
export type {
  CssVariable,
  PaletteColor,
  PaletteScale,
  PaletteStep,
  SemanticColor,
  ThemeName,
  ThemeTokens,
} from './tokens';
export { cn } from './utils/cn';
export type { ClassValue } from './utils/cn';
export type {
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicPropsWithRef,
  PolymorphicRef,
} from './utils/polymorphic';
