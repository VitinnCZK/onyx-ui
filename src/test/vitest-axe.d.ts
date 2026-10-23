import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

// vitest-axe ships typings for the legacy `Vi` namespace; register its matchers on the current API.
declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion extends AxeMatchers {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
