import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { breakpoints, cssVariables, themeVariables } from '@/tokens';

const root = import.meta.dirname;
const read = (...path: string[]) => readFileSync(join(root, ...path), 'utf8');

const components = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const sheets = components.flatMap((name) =>
  readdirSync(join(root, name))
    .filter((file) => file.endsWith('.module.css') && !file.endsWith('.stories.module.css'))
    .map((file) => [name, file] as const),
);

const tokens = new Set([
  ...Object.keys(cssVariables),
  ...Object.values(themeVariables).flatMap(Object.keys),
]);

/** Sheets allowed to use raw lengths, and why. */
const rawLengthExempt: Record<string, string> = {
  'VisuallyHidden.module.css': 'the 1px clip box is the technique itself, not a size',
};

/** Variables that shared sheets in src/styles declare for the components that use them. */
const shared = new Set(
  readdirSync(join(root, '../styles'))
    .filter((file) => file.endsWith('.module.css'))
    .flatMap((file) =>
      [...read('../styles', file).matchAll(/(--[\w-]+)\s*:/g)].map(([, variable]) => variable),
    ),
);

const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

const mediaQueries = /@media[^{]*/g;

describe('components', () => {
  it.each(components)('%s has a component, stories, tests and an index', (name) => {
    const missing = [`${name}.tsx`, `${name}.stories.tsx`, `${name}.test.tsx`, 'index.ts'].filter(
      (file) => !existsSync(join(root, name, file)),
    );

    expect(missing).toEqual([]);
  });

  it.each(components)('%s is exported from the package entry', (name) => {
    expect(read('../index.ts')).toContain(`from './components/${name}';`);
  });
});

describe.each(sheets)('%s/%s', (name, file) => {
  const css = withoutComments(read(name, file));
  const local = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(([, variable]) => variable));

  it('only references tokens or variables it declares', () => {
    const references = [...css.matchAll(/var\((--[\w-]+)/g)].map(([, variable]) => variable!);

    expect(
      references.filter(
        (variable) => !tokens.has(variable) && !local.has(variable) && !shared.has(variable),
      ),
    ).toEqual([]);
  });

  it('has no raw colors', () => {
    expect(css).not.toMatch(
      /#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(|(?<![\w-])(?:white|black)(?![\w-])/i,
    );
  });

  it.skipIf(file in rawLengthExempt)('has no raw lengths or durations', () => {
    const rules = css.replace(mediaQueries, '');

    expect(rules.match(/(?<![\w.-])\d*\.?\d+(?:px|rem|ms|s)\b/g) ?? []).toEqual([]);
  });

  it('only uses breakpoint values in media queries', () => {
    const allowed: string[] = Object.values(breakpoints);
    const lengths = (css.match(mediaQueries) ?? []).flatMap(
      (query) => query.match(/\d*\.?\d+(?:px|rem|em)/g) ?? [],
    );

    expect(lengths.filter((length) => !allowed.includes(length))).toEqual([]);
  });
});
