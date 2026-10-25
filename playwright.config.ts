import { existsSync, rmdirSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.STORYBOOK_PORT ?? 6006);

// Storybook reads "[...]" and other glob characters in the project path as a pattern and cannot
// find its config, so it is started from a link with a plain path instead.
function storybookCwd() {
  const root = process.cwd();
  if (!/[[\]{}*?]/.test(root)) return root;

  const link = join(tmpdir(), 'onyx-ui-storybook');
  if (!existsSync(join(link, 'package.json'))) {
    if (existsSync(link)) rmdirSync(link);
    symlinkSync(root, link, 'junction');
  }
  return link;
}

export default defineConfig({
  testDir: './a11y',
  outputDir: './test-results/a11y',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 120_000,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx storybook dev -p ${port} --ci`,
    cwd: storybookCwd(),
    url: `http://localhost:${port}/index.json`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
