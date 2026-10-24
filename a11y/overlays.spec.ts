import { expect, test, type Locator, type Page } from '@playwright/test';
import { gotoStory, makeScrollable, pageScroll, press } from './storybook';

/** Clicks the page outside the given element, away from anything interactive. */
async function clickOutside(page: Page, element: Locator) {
  const box = (await element.boundingBox())!;
  const viewport = page.viewportSize()!;
  const x = box.x > 40 ? 10 : viewport.width - 10;
  await page.mouse.click(x, viewport.height - 10);
}

/** Tabs `count` times in each direction and checks focus never leaves `container`. */
async function expectTrapped(page: Page, container: Locator, count = 8) {
  for (const key of ['Tab', 'Shift+Tab']) {
    for (let step = 0; step < count; step++) {
      await page.keyboard.press(key);
      expect(
        await container.evaluate((element) => element.contains(document.activeElement)),
        `focus left the dialog after ${step + 1} × ${key}`,
      ).toBe(true);
    }
  }
}

const dialogs = [
  {
    name: 'Modal',
    story: 'overlays-modal--default',
    trigger: 'Invite teammate',
    focusables: ['Close', 'Email', 'Cancel', 'Send invite'],
  },
  {
    name: 'Drawer',
    story: 'overlays-drawer--default',
    trigger: 'Show filters',
    focusables: ['Close', 'In stock', 'On sale', 'Free shipping', 'Reset', 'Apply'],
  },
];

for (const { name, story, trigger: triggerName, focusables } of dialogs) {
  test.describe(name, () => {
    test('opens with focus on the first control and keeps Tab inside, in order', async ({
      page,
    }) => {
      await gotoStory(page, story);
      const trigger = page.getByRole('button', { name: triggerName });
      await press(page, 'Tab');
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      await press(page, 'Enter');

      const dialog = page.getByRole('dialog');
      const focused = page.locator(':focus');
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(focused).toHaveAccessibleName(focusables[0]!);

      for (const label of [...focusables.slice(1), focusables[0]!]) {
        await press(page, 'Tab');
        await expect(focused).toHaveAccessibleName(label);
      }
      await press(page, 'Shift+Tab');
      await expect(focused).toHaveAccessibleName(focusables.at(-1)!);
      await expectTrapped(page, dialog);
    });

    test('Escape closes it and focus returns to the trigger', async ({ page }) => {
      await gotoStory(page, story);
      const trigger = page.getByRole('button', { name: triggerName });
      await press(page, 'Tab', 'Enter', 'Tab', 'Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test('the close button closes it and focus returns to the trigger', async ({ page }) => {
      await gotoStory(page, story);
      const trigger = page.getByRole('button', { name: triggerName });
      await press(page, 'Tab', 'Enter', 'Enter');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test('a click on the backdrop closes it and focus returns to the trigger', async ({ page }) => {
      await gotoStory(page, story);
      const trigger = page.getByRole('button', { name: triggerName });
      await press(page, 'Tab', 'Enter');
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await clickOutside(page, dialog);
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });

    test('a click inside does not let focus escape the dialog', async ({ page }) => {
      await gotoStory(page, story);
      await press(page, 'Tab', 'Enter');
      const dialog = page.getByRole('dialog');
      await dialog.getByRole('heading').click();
      await press(page, 'Tab');
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(
        true,
      );
    });

    test('the page behind does not scroll while it is open', async ({ page }) => {
      await gotoStory(page, story);
      await makeScrollable(page);
      const before = await pageScroll(page);

      await page.getByRole('button', { name: triggerName }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      expect((await pageScroll(page)).overflow).toBe('hidden');
      await page.mouse.move(5, 5);
      await page.mouse.wheel(0, 800);
      await page.keyboard.press('PageDown');
      await page.waitForTimeout(100);
      expect((await pageScroll(page)).y).toBe(before.y);

      await press(page, 'Escape');
      expect(await pageScroll(page)).toEqual(before);
      await page.mouse.wheel(0, 400);
      await expect.poll(async () => (await pageScroll(page)).y).toBeGreaterThan(before.y);
    });
  });
}

test.describe('Modal', () => {
  test('an alertdialog ignores backdrop clicks and footer buttons return focus', async ({
    page,
  }) => {
    await gotoStory(page, 'overlays-modal--controlled-confirmation');
    const trigger = page.getByRole('button', { name: 'Delete project' });
    await press(page, 'Tab', 'Enter');

    const dialog = page.getByRole('alertdialog', { name: 'Delete this project?' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription(/cannot be undone/);
    await clickOutside(page, dialog);
    await expect(dialog).toBeVisible();

    await dialog.getByRole('button', { name: 'Cancel' }).focus();
    await press(page, 'Enter');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test('an initially open dialog traps focus from the start', async ({ page }) => {
    await gotoStory(page, 'overlays-modal--open');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();
    await expectTrapped(page, dialog);
  });

  test('long content scrolls inside the dialog with the keyboard', async ({ page }) => {
    await gotoStory(page, 'overlays-modal--long-content');
    await page.setViewportSize({ width: 800, height: 500 });
    await press(page, 'Tab', 'Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const body = dialog.getByText('Section 1.', { exact: false }).locator('..');
    const scrollTop = () => body.evaluate((element) => element.scrollTop);

    await press(page, 'Tab');
    await expect(body).toBeFocused();
    await press(page, 'PageDown');
    await expect.poll(scrollTop).toBeGreaterThan(0);
    await press(page, 'Tab');
    await expect(dialog.getByRole('button', { name: 'Accept' })).toBeFocused();
    await expect(dialog.getByRole('button', { name: 'Accept' })).toBeInViewport();
  });
});

test.describe('Popover', () => {
  const trigger = (page: Page) => page.getByRole('button', { name: 'Notifications' });

  test('moves focus inside on open and Tab continues through its content', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--default');
    await press(page, 'Tab');
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
    await press(page, 'Enter');

    const popover = page.getByRole('dialog', { name: 'Notification settings' });
    await expect(popover).toBeVisible();
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
    await expect(popover.getByRole('switch', { name: 'Email' })).toBeFocused();
    await press(page, 'Tab');
    await expect(popover.getByRole('switch', { name: 'Push' })).toBeFocused();
    await press(page, 'Shift+Tab', 'Shift+Tab');
    await expect(trigger(page)).toBeFocused();
    await expect(popover).toBeVisible();
  });

  test('Escape closes it and focus returns to the trigger', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--default');
    await press(page, 'Tab', 'Enter', 'Tab', 'Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('the close button closes it and focus returns to the trigger', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--with-form');
    const rename = page.getByRole('button', { name: 'Rename' });
    await press(page, 'Tab', 'Enter');
    const popover = page.getByRole('dialog', { name: 'Rename file' });
    await expect(popover.getByRole('button', { name: 'Close' })).toBeFocused();
    await press(page, 'Enter');
    await expect(popover).toHaveCount(0);
    await expect(rename).toBeFocused();
  });

  test('a click outside closes it without leaving focus on the page body', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--default');
    await press(page, 'Tab', 'Enter');
    const popover = page.getByRole('dialog');
    await expect(popover).toBeVisible();
    await clickOutside(page, popover);
    await expect(popover).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test('tabbing past the end closes it', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--default');
    await page.evaluate(() => {
      const next = document.createElement('button');
      next.textContent = 'Next control';
      document.body.append(next);
    });
    await press(page, 'Tab', 'Enter', 'Tab', 'Tab', 'Tab');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Next control' })).toBeFocused();
  });

  test('does not lock page scrolling', async ({ page }) => {
    await gotoStory(page, 'overlays-popover--default');
    await makeScrollable(page);
    await trigger(page).focus();
    await press(page, 'Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    expect((await pageScroll(page)).overflow).toBe('');
  });
});

test.describe('DropdownMenu', () => {
  const trigger = (page: Page) => page.getByRole('button', { name: 'Options' });

  test('Escape closes it and focus returns to the trigger', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    await press(page, 'Tab', 'Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'true');
    await press(page, 'Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('a click outside closes it without leaving focus on the page body', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    await press(page, 'Tab', 'Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await clickOutside(page, menu);
    await expect(menu).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test('a click on an item closes it and focus returns to the trigger', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    await trigger(page).click();
    await page.getByRole('menuitem', { name: 'Duplicate' }).click();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
  });

  test('Tab closes it and moves on instead of trapping focus', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    await press(page, 'Tab', 'Enter', 'Tab');
    await expect(page.getByRole('menu')).toHaveCount(0);
    expect(await page.evaluate(() => document.activeElement?.getAttribute('role'))).not.toBe(
      'menuitem',
    );
  });

  test('an initially open menu has focus on its first item', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--open');
    await expect(page.getByRole('menuitem', { name: 'Edit' })).toBeFocused();
    await press(page, 'Escape');
    await expect(trigger(page)).toBeFocused();
  });

  test('does not lock page scrolling', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    await makeScrollable(page);
    await trigger(page).focus();
    await press(page, 'Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    expect((await pageScroll(page)).overflow).toBe('');
  });
});

test.describe('Tooltip', () => {
  const trigger = (page: Page) => page.getByRole('button', { name: 'Copy link' });

  test('shows on focus, describes the trigger and never takes focus', async ({ page }) => {
    await gotoStory(page, 'feedback-tooltip--default');
    await press(page, 'Tab');
    await expect(trigger(page)).toBeFocused();
    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(trigger(page)).toHaveAccessibleDescription('Copy the link to your clipboard');

    await press(page, 'Tab');
    await expect(tooltip).toHaveCount(0);
    await press(page, 'Shift+Tab');
    await expect(trigger(page)).toBeFocused();
    await expect(tooltip).toBeVisible();
  });

  test('Escape hides it and focus stays on the trigger', async ({ page }) => {
    await gotoStory(page, 'feedback-tooltip--default');
    await press(page, 'Tab', 'Escape');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
    await expect(trigger(page)).toBeFocused();
    await expect(trigger(page)).toHaveAccessibleDescription('Copy the link to your clipboard');
  });

  test('a disabled tooltip never shows', async ({ page }) => {
    await gotoStory(page, 'feedback-tooltip--disabled');
    await press(page, 'Tab');
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });
});
