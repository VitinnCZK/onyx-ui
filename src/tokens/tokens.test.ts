import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  cssVariables,
  reducedMotionVariables,
  spacing,
  themes,
  themeVariables,
  zIndex,
  type ThemeName,
} from '.';

// Read from disk: Vitest replaces imported CSS (`?raw` included) with an empty string.
const read = (path: string) => readFileSync(join(import.meta.dirname, path), 'utf8');

const cssFilesIn = (dir: string) =>
  readdirSync(join(import.meta.dirname, dir))
    .filter((file) => file.endsWith('.css') && !file.endsWith('.module.css'))
    .map((file) => `${dir}/${file}`);

const stylesEntry = read('../styles/index.css');
const files = [...cssFilesIn('../tokens'), ...cssFilesIn('../styles/themes')];

const normalize = (value: string) =>
  value
    .replace(/\s+/g, ' ')
    .replace(/\s*,\s*/g, ', ')
    .trim();

interface Declaration {
  /** Enclosing selectors and at-rules, outermost first, e.g. `@media (…) > :root`. */
  context: string;
  property: string;
  value: string;
}

/** Minimal CSS reader: enough for flat token files with at most nested at-rules. */
function parseDeclarations(css: string): Declaration[] {
  const declarations: Declaration[] = [];
  const stack: string[] = [];
  let buffer = '';

  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, '')) {
    if (char === '{') {
      stack.push(normalize(buffer));
      buffer = '';
    } else if (char === ';' || char === '}') {
      const separator = buffer.indexOf(':');
      if (separator > 0 && stack.length > 0) {
        declarations.push({
          context: stack.join(' > '),
          property: buffer.slice(0, separator).trim(),
          value: normalize(buffer.slice(separator + 1)),
        });
      }
      buffer = '';
      if (char === '}') stack.pop();
    } else {
      buffer += char;
    }
  }

  return declarations;
}

const declarations = files.flatMap((file) => parseDeclarations(read(file)));

const themeSelectors: Record<ThemeName, string> = {
  light: ":root, [data-theme='light']",
  dark: "[data-theme='dark']",
};

/** Every rule the stylesheets must contain, with exactly these declarations. */
const expectedRules: Record<string, Record<string, string>> = {
  ':root': cssVariables,
  '@media (prefers-reduced-motion: reduce) > :root': reducedMotionVariables,
  ...Object.fromEntries(
    Object.entries(themes).map(([name, theme]) => [
      themeSelectors[name as ThemeName],
      { 'color-scheme': theme.colorScheme, ...themeVariables[name as ThemeName] },
    ]),
  ),
};

describe('design tokens', () => {
  it('declares in CSS exactly the tokens defined in TypeScript', () => {
    const actual: Record<string, Record<string, string>> = {};
    for (const { context, property, value } of declarations) {
      (actual[context] ??= {})[property] = value;
    }

    const expected = Object.fromEntries(
      Object.entries(expectedRules).map(([context, rule]) => [
        context,
        Object.fromEntries(Object.entries(rule).map(([name, value]) => [name, normalize(value)])),
      ]),
    );

    expect(actual).toEqual(expected);
  });

  it('declares every variable once per rule', () => {
    const keys = declarations.map(({ context, property }) => `${context} ${property}`);

    expect(keys.filter((key, index) => keys.indexOf(key) !== index)).toEqual([]);
  });

  it('gives every theme the same variables', () => {
    const [first, ...rest] = Object.values(themeVariables).map((variables) =>
      Object.keys(variables).sort(),
    );

    for (const keys of rest) expect(keys).toEqual(first);
  });

  it('only references variables that exist', () => {
    const declared = new Set([
      ...Object.keys(cssVariables),
      ...Object.values(themeVariables).flatMap(Object.keys),
    ]);
    const references = Object.values(expectedRules)
      .flatMap(Object.values)
      .flatMap((value) => [...value.matchAll(/var\((--[\w-]+)\)/g)].map(([, name]) => name!));

    expect(references.filter((name) => !declared.has(name))).toEqual([]);
  });

  it('imports every token and theme file from the published stylesheet', () => {
    const missing = files
      .map((path) => path.replace('../styles/', './'))
      .filter((path) => !stylesEntry.includes(`@import '${path}';`));

    expect(missing).toEqual([]);
  });

  it('collapses every duration under reduced motion', () => {
    expect(Object.keys(reducedMotionVariables)).toEqual(
      Object.keys(cssVariables).filter((name) => name.startsWith('--duration-')),
    );
  });

  it('keeps spacing on a 4px grid', () => {
    for (const [step, value] of Object.entries(spacing)) {
      const pixels = value === '0' ? 0 : parseFloat(value) * 16;

      expect(value === '0' || value.endsWith('rem')).toBe(true);
      expect(pixels).toBe(Number(step) * 4);
    }
  });

  it('stacks floating layers in order', () => {
    const order = ['dropdown', 'overlay', 'modal', 'toast', 'tooltip'] as const;
    const values = order.map((layer) => Number(zIndex[layer]));

    expect(values).toEqual([...values].sort((a, b) => a - b));
    expect(new Set(values).size).toBe(order.length);
  });
});
