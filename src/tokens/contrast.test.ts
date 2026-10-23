import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/test/contrast';
import { cssVariables, semanticColors, type CssVariable, type SemanticColor } from '.';

/** WCAG AA minimums: 1.4.3 for text, 1.4.11 for UI components and focus indicators. */
const minimum = { text: 4.5, ui: 3 } as const;

interface Pair {
  fg: SemanticColor;
  bg: SemanticColor;
  kind: keyof typeof minimum;
}

const intents = ['primary', 'success', 'warning', 'danger', 'info'] as const;
const backgrounds: SemanticColor[] = ['bg', 'bg-subtle', 'bg-muted', 'surface', 'surface-raised'];

const cross = (fgs: SemanticColor[], bgs: SemanticColor[], kind: Pair['kind']): Pair[] =>
  fgs.flatMap((fg) => bgs.map((bg) => ({ fg, bg, kind })));

const pairs: Pair[] = [
  ...cross(
    ['text', 'text-muted', ...intents.map((intent) => `${intent}-text` as const)],
    [...backgrounds, ...intents.map((intent) => `${intent}-subtle` as const)],
    'text',
  ),
  ...intents.flatMap((intent) =>
    cross([`on-${intent}`], [intent, `${intent}-hover`, `${intent}-active`], 'text'),
  ),
  { fg: 'text-inverse', bg: 'bg-inverse', kind: 'text' },
  ...cross(['border-strong', 'focus', ...intents], backgrounds, 'ui'),
];

/** Semantic colors with no contrast requirement, and why. */
const exempt: Partial<Record<SemanticColor, string>> = {
  'text-disabled': 'WCAG 1.4.3 exempts text of inactive components',
  backdrop: 'dims the page behind overlays; never sits behind text it has to keep legible',
  border: 'decorative; borders that identify a control use border-strong',
  ...Object.fromEntries(
    intents.map((intent) => [`${intent}-border`, 'decorative; the subtle background carries text']),
  ),
};

/**
 * Themes to check, as complete variable maps. A theme that overrides the semantic layer
 * (e.g. dark) is added here as `{ ...cssVariables, ...overrides }`.
 */
const themes: Record<string, Record<CssVariable, string>> = {
  light: cssVariables,
};

function resolveColor(variables: Record<CssVariable, string>, name: CssVariable): string {
  let value = variables[name];
  for (let depth = 0; value?.startsWith('var('); depth++) {
    if (depth > 10) throw new Error(`Circular reference while resolving ${name}`);
    value = variables[value.slice(4, -1).trim() as CssVariable];
  }
  if (value === undefined) throw new Error(`${name} does not resolve to a value`);
  return value;
}

describe.each(Object.entries(themes))('%s theme contrast', (_theme, variables) => {
  const color = (token: SemanticColor) => resolveColor(variables, `--color-${token}`);

  it.each(pairs)('$fg on $bg meets the $kind minimum', ({ fg, bg, kind }) => {
    expect(contrastRatio(color(fg), color(bg))).toBeGreaterThanOrEqual(minimum[kind]);
  });
});

describe('contrast coverage', () => {
  it('checks or explicitly exempts every semantic color', () => {
    const checked = new Set(pairs.flatMap(({ fg, bg }) => [fg, bg]));
    const unchecked = Object.keys(semanticColors).filter(
      (token) => !checked.has(token as SemanticColor) && !(token in exempt),
    );

    expect(unchecked).toEqual([]);
  });

  it('does not exempt a color that is checked', () => {
    const checked = new Set(pairs.flatMap(({ fg, bg }) => [fg, bg]));

    expect(Object.keys(exempt).filter((token) => checked.has(token as SemanticColor))).toEqual([]);
  });
});

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#ffffff', '#ffffff')).toBe(1);
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });

  it('rejects values it cannot measure', () => {
    expect(() => contrastRatio('rgb(0 0 0)', '#ffffff')).toThrow(/#rrggbb/);
  });
});
