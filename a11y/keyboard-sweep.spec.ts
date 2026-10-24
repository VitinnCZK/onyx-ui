import { expect, test, type Page } from '@playwright/test';
import { gotoStory, storiesIn, storyFiles } from './storybook';

/** Covers the focus ring: offset plus width. */
const ringPadding = 4;

/**
 * Tags every element that Tab should reach with `data-kb`, in document order. Inside an open
 * modal dialog only its content counts. Radios count once per group, like the browser does.
 */
function markTabbables(page: Page) {
  return page.evaluate(() => {
    const scope = document.querySelector<HTMLElement>('[aria-modal="true"]') ?? document.body;
    const selector =
      'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex], [contenteditable]';
    const seenGroups = new Set<string>();

    const elements = [...scope.querySelectorAll<HTMLElement>(selector)].filter((element) => {
      if (element.tabIndex < 0 || element.matches(':disabled') || element.closest('[inert]')) {
        return false;
      }
      if (!element.checkVisibility({ visibilityProperty: true })) return false;
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      if (element instanceof HTMLInputElement && element.type === 'radio' && element.name) {
        const group = [
          ...document.querySelectorAll<HTMLInputElement>(
            `input[type="radio"][name="${CSS.escape(element.name)}"]:not(:disabled)`,
          ),
        ];
        const entry = group.find((radio) => radio.checked) ?? group[0];
        if (entry !== element || seenGroups.has(element.name)) return false;
        seenGroups.add(element.name);
      }
      return true;
    });

    elements.forEach((element, index) => (element.dataset.kb = String(index)));
    return elements.length;
  });
}

async function clipOf(page: Page, selector: string) {
  return page.evaluate(
    ({ selector, ringPadding }) => {
      const element = document.querySelector(selector)!;
      element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, rect.left - ringPadding);
      const y = Math.max(0, rect.top - ringPadding);
      return {
        x,
        y,
        width: Math.min(window.innerWidth, rect.right + ringPadding) - x,
        height: Math.min(window.innerHeight, rect.bottom + ringPadding) - y,
      };
    },
    { selector, ringPadding },
  );
}

async function shoot(page: Page, index: number) {
  const clip = await clipOf(page, `[data-kb="${index}"]`);
  return page.screenshot({ clip, animations: 'disabled', caret: 'hide' });
}

/** `data-kb` of the focused element, `null` when nothing is focused, `-1` for other elements. */
function activeIndex(page: Page) {
  return page.evaluate(() => {
    const element = document.activeElement as HTMLElement | null;
    if (!element || element === document.body) return null;
    return element.dataset.kb === undefined ? -1 : Number(element.dataset.kb);
  });
}

for (const file of storyFiles) {
  test(`keyboard reaches every control with a focus ring: ${file}`, async ({ page }) => {
    for (const story of await storiesIn(page, file)) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        await page.mouse.move(0, 0);
        const count = await markTabbables(page);

        // Stories that open an overlay move focus on load; take the baselines without it.
        const autofocused = await page.evaluateHandle(() => {
          const element = document.activeElement as HTMLElement | null;
          element?.blur();
          return element === document.body ? null : element;
        });
        const baselines: Buffer[] = [];
        for (let index = 0; index < count; index++) baselines.push(await shoot(page, index));
        await page.evaluate((element) => {
          window.scrollTo(0, 0);
          element?.focus();
        }, autofocused);

        const ringChecked = new Set<number>();
        const checkRing = async (index: number) => {
          if (index < 0 || ringChecked.has(index)) return;
          ringChecked.add(index);
          const focused = await shoot(page, index);
          expect
            .soft(
              focused.equals(baselines[index]!),
              `${story.id}: no focus ring on [data-kb=${index}]`,
            )
            .toBe(false);
        };

        const walk = async (key: 'Tab' | 'Shift+Tab', start: number | null) => {
          const visited: number[] = [];
          if (start !== null && start >= 0) visited.push(start);
          for (let step = 0; step < count + 5; step++) {
            await page.keyboard.press(key);
            const index = await activeIndex(page);
            if (index === null || (index >= 0 && visited.includes(index))) break;
            if (index >= 0) {
              visited.push(index);
              await checkRing(index);
            }
          }
          return visited;
        };

        const initial = await activeIndex(page);
        if (initial !== null) await checkRing(initial);
        const forward = await walk('Tab', initial);
        const backward = await walk('Shift+Tab', null);

        // Overlays open on load already hold focus, so Tab starts halfway through the page.
        const reached = new Set(initial === null ? forward : [...forward, ...backward]);
        const missed = Array.from({ length: count }, (_, index) => index).filter(
          (index) => !reached.has(index),
        );
        expect.soft(missed, `${story.id}: Tab never reached these [data-kb] elements`).toEqual([]);

        const reversed = [...backward].reverse();
        expect
          .soft(
            initial === null ? reversed : reversed.slice(reversed.length - forward.length),
            `${story.id}: Shift+Tab does not walk back through the Tab order`,
          )
          .toEqual(forward);
      });
    }
  });
}
