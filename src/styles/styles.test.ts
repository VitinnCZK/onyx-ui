import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cssVariables, themeVariables } from '@/tokens';

const read = (file: string) => readFileSync(join(import.meta.dirname, file), 'utf8');

const sheets = [
  'reset.css',
  'base.css',
  'focus-ring.module.css',
  'field.module.css',
  'choice.module.css',
  'story-layout.module.css',
];

const declared = new Set([
  ...Object.keys(cssVariables),
  ...Object.values(themeVariables).flatMap(Object.keys),
]);

describe('global styles', () => {
  it('imports the reset and base styles after the tokens and themes', () => {
    const imports = [...read('index.css').matchAll(/@import '([^']+)';/g)].map(([, path]) => path);

    expect(imports.slice(-2)).toEqual(['./reset.css', './base.css']);
  });

  it('paints the page with the theme tokens', () => {
    const body = /body\s*{([^}]*)}/.exec(read('base.css'))?.[1];

    expect(body).toContain('background-color: var(--color-bg)');
    expect(body).toContain('color: var(--color-text)');
    expect(body).toContain('font-family: var(--font-family-base)');
  });

  it.each(sheets)('%s only references existing tokens or its own variables', (file) => {
    const css = read(file);
    const own = new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map(([, name]) => name));
    const references = [...css.matchAll(/var\((--[\w-]+)/g)].map(([, name]) => name!);

    expect(references.filter((name) => !declared.has(name) && !own.has(name))).toEqual([]);
  });

  it.each(sheets)('%s has no raw colors', (file) => {
    expect(read(file)).not.toMatch(/#[\da-f]{3,8}\b|\b(?:rgb|hsl|oklch)a?\(/i);
  });
});
