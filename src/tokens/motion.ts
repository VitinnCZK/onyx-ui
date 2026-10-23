export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

export const easing = {
  linear: 'linear',
  /** Elements that move or resize while staying on screen. */
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  /** Elements entering the screen: start fast, settle slowly. */
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Elements leaving the screen: start slowly, leave fast. */
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;
