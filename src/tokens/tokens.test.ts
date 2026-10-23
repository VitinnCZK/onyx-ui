import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cssVariables, spacing, zIndex, type CssVariable } from '.';

// Read from disk: Vitest replaces imported CSS (`?raw` included) with an empty string.
const read = (path: string) => readFileSync(join(import.meta.dirname, path), 'utf8');

const stylesEntry = read('../styles/index.css');
const sources = Object.fromEntries(
  readdirSync(import.meta.dirname)
    .filter((file) => file.endsWith('.css') && !file.endsWith('.module.css'))
    .map((file) => [`./${file}`, read(file)]),
);

const normalize = (value: string) => value.replace(/\s+/g, ' ').trim();

function parseDeclarations(css: string): [CssVariable, string][] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...withoutComments.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [
    name as CssVariable,
    normalize(value!),
  ]);
}

const declarations = Object.values(sources).flatMap(parseDeclarations);

describe('design tokens', () => {
  it('declares in CSS exactly the tokens defined in TypeScript', () => {
    const expected = Object.fromEntries(
      Object.entries(cssVariables).map(([name, value]) => [name, normalize(value)]),
    );

    expect(Object.fromEntries(declarations)).toEqual(expected);
  });

  it('declares every variable once', () => {
    const names = declarations.map(([name]) => name);

    expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
  });

  it('only references variables that exist', () => {
    const references = Object.values(cssVariables).flatMap((value) =>
      [...value.matchAll(/var\((--[\w-]+)\)/g)].map(([, name]) => name as CssVariable),
    );

    expect(references.filter((name) => !(name in cssVariables))).toEqual([]);
  });

  it('imports every token file from the published stylesheet', () => {
    const missing = Object.keys(sources)
      .map((path) => path.replace('./', '../tokens/'))
      .filter((path) => !stylesEntry.includes(`@import '${path}';`));

    expect(missing).toEqual([]);
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
