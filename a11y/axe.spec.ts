import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { gotoStory, storiesIn, storyFiles, type Theme } from './storybook';

/** Rules about whole pages, which a story rendered on its own cannot satisfy. */
const pageRules = ['region', 'page-has-heading-one', 'landmark-one-main'];

const themes: Theme[] = ['light', 'dark'];

for (const theme of themes) {
  for (const file of storyFiles) {
    test(`no axe violations in the ${theme} theme: ${file}`, async ({ page }) => {
      for (const story of await storiesIn(page, file)) {
        await test.step(story.id, async () => {
          await gotoStory(page, story.id, theme);
          const { violations } = await new AxeBuilder({ page }).disableRules(pageRules).analyze();
          const summary = violations.map(({ id, help, nodes }) => ({
            rule: id,
            help,
            targets: nodes.map((node) => node.target.join(' ')),
          }));
          expect.soft(summary, `${story.id} (${theme})`).toEqual([]);
        });
      }
    });
  }
}
