import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import { gotoStory, storiesIn, storyFiles } from './storybook';

// A 1280 × 800 window zoomed to 200% lays the page out in 640 × 400 CSS pixels.
test.use({ viewport: { width: 640, height: 400 } });

interface LayoutProblem {
  kind: 'page-scroll' | 'clipped' | 'overlap';
  detail: string;
}

/** Finds horizontal page scrolling, content cut off by its container and content drawn over other content. */
function findLayoutProblems(page: Page) {
  return page.evaluate(() => {
    const problems: LayoutProblem[] = [];
    const tolerance = 1;
    const { documentElement } = document;

    if (documentElement.scrollWidth > documentElement.clientWidth + tolerance) {
      problems.push({
        kind: 'page-scroll',
        detail: `page is ${documentElement.scrollWidth}px wide in a ${documentElement.clientWidth}px viewport`,
      });
    }

    const describe = (element: Element) => {
      const text = (element.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 30);
      const label = element.getAttribute('aria-label');
      return `<${element.tagName.toLowerCase()}> "${label ?? text}"`;
    };

    const roots = [...document.body.children].filter(
      (element) =>
        !element.matches(
          'script, .sb-wrapper, .sb-preparing-story, .sb-preparing-docs, .sb-errordisplay, #storybook-docs',
        ) && !element.hasAttribute('data-test-spacer'),
    );

    const isVisuallyHidden = (style: CSSStyleDeclaration) =>
      style.clipPath.includes('inset(50%)') || style.clip.startsWith('rect(0');

    const isContent = (element: Element) =>
      element.matches('button, input, select, textarea, img, svg, progress, meter') ||
      [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent!.trim() !== '',
      );

    const boxes: { element: Element; rect: DOMRect; layer: Element }[] = [];

    for (const root of roots) {
      for (const element of [root, ...root.querySelectorAll('*')]) {
        if (element.closest('svg') && element.tagName.toLowerCase() !== 'svg') continue;
        if (!element.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
        const style = getComputedStyle(element);
        if (isVisuallyHidden(style)) continue;
        const rect = element.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2 || !isContent(element)) continue;

        let truncated = false;
        let layer: Element = root;
        // Fixed layers, like dialogs, are not clipped by the overflow of their ancestors.
        let escaped = style.position === 'fixed';
        for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
          const ancestorStyle = getComputedStyle(ancestor);
          if (isVisuallyHidden(ancestorStyle)) {
            truncated = true;
            break;
          }
          if (ancestorStyle.textOverflow === 'ellipsis') truncated = true;
          if (layer === root && ['absolute', 'fixed'].includes(ancestorStyle.position)) {
            layer = ancestor;
          }

          const clipsX = ['hidden', 'clip'].includes(ancestorStyle.overflowX);
          const clipsY = ['hidden', 'clip'].includes(ancestorStyle.overflowY);
          if (truncated || escaped || (!clipsX && !clipsY)) {
            escaped ||= ancestorStyle.position === 'fixed';
            continue;
          }
          const bounds = ancestor.getBoundingClientRect();
          const outX =
            clipsX &&
            (rect.left < bounds.left - tolerance || rect.right > bounds.right + tolerance);
          const outY =
            clipsY &&
            (rect.top < bounds.top - tolerance || rect.bottom > bounds.bottom + tolerance);
          if (outX || outY) {
            problems.push({
              kind: 'clipped',
              detail: `${describe(element)} is cut off by ${describe(ancestor)}`,
            });
            truncated = true;
          }
          escaped ||= ancestorStyle.position === 'fixed';
        }
        if (truncated) continue;

        if (rect.right > documentElement.clientWidth + tolerance) {
          problems.push({ kind: 'clipped', detail: `${describe(element)} overflows the viewport` });
        }
        if (['absolute', 'fixed'].includes(style.position)) layer = element;
        boxes.push({ element, rect, layer });
      }
    }

    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]!;
        const b = boxes[j]!;
        if (a.layer !== b.layer || a.element.contains(b.element) || b.element.contains(a.element)) {
          continue;
        }
        const width = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left);
        const height = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top);
        if (width > 2 && height > 2) {
          problems.push({
            kind: 'overlap',
            detail: `${describe(a.element)} overlaps ${describe(b.element)}`,
          });
        }
      }
    }

    return problems;
  });
}

for (const file of storyFiles) {
  test(`layout holds at 200% zoom: ${file}`, async ({ page }, testInfo) => {
    for (const story of await storiesIn(page, file)) {
      await test.step(story.id, async () => {
        await gotoStory(page, story.id);
        await page.screenshot({
          path: join(testInfo.project.outputDir, 'zoom', `${story.id}.png`),
          fullPage: true,
          animations: 'disabled',
        });
        expect.soft(await findLayoutProblems(page), story.id).toEqual([]);
      });
    }
  });
}
