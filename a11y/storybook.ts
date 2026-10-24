import { globSync } from 'node:fs';
import { expect, type Page } from '@playwright/test';

export type Theme = 'light' | 'dark';

export interface StoryEntry {
  id: string;
  title: string;
  name: string;
  importPath: string;
}

/** Story files, known before the Storybook server starts so each one can become a test. */
export const storyFiles = globSync('src/**/*.stories.tsx')
  .map((file) => `./${file.replaceAll('\\', '/')}`)
  .sort();

let index: Promise<StoryEntry[]> | undefined;

async function loadIndex(page: Page) {
  const response = await page.request.get('/index.json');
  const { entries } = (await response.json()) as {
    entries: Record<string, StoryEntry & { type: string }>;
  };
  return Object.values(entries).filter((entry) => entry.type === 'story');
}

export async function storiesIn(page: Page, file: string) {
  index ??= loadIndex(page);
  const stories = (await index).filter((entry) => entry.importPath === file);
  expect(stories.length, `no stories found for ${file}`).toBeGreaterThan(0);
  return stories;
}

export async function gotoStory(page: Page, id: string, theme: Theme = 'light') {
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  // The story mounts again once the theme global applies, so wait for the whole render cycle.
  await page.waitForFunction(() => {
    const preview = (window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
      .__STORYBOOK_PREVIEW__;
    return (
      preview?.currentRender?.phase === 'finished' ||
      document.body.classList.contains('sb-show-errordisplay')
    );
  });
  await expect(page.locator('body'), `story ${id} failed to render`).not.toHaveClass(
    /sb-show-errordisplay/,
  );
  await page.evaluate(() => document.fonts.ready);
}

export async function press(page: Page, ...keys: string[]) {
  for (const key of keys) await page.keyboard.press(key);
}

/** Makes the page taller than the viewport so scroll locking can be observed. */
export async function makeScrollable(page: Page) {
  await page.evaluate(() => {
    const spacer = document.createElement('div');
    spacer.dataset.testSpacer = '';
    spacer.style.height = '3000px';
    document.body.append(spacer);
  });
}

export async function pageScroll(page: Page) {
  return page.evaluate(() => ({
    y: window.scrollY,
    overflow: document.body.style.overflow,
  }));
}
