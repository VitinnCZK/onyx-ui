import { expect, test, type Locator, type Page } from '@playwright/test';
import { gotoStory, press } from './storybook';

/** Counts clicks on the element, which is what Enter and Space trigger on buttons. */
async function countClicks(locator: Locator) {
  await locator.evaluate((element) => {
    element.addEventListener('click', () => {
      element.dataset.clicks = String(Number(element.dataset.clicks ?? 0) + 1);
    });
  });
  return () => locator.getAttribute('data-clicks').then((value) => Number(value ?? 0));
}

test.describe('Button', () => {
  test('Enter and Space activate it', async ({ page }) => {
    await gotoStory(page, 'primitives-button--default');
    const button = page.locator('#storybook-root').getByRole('button');
    const clicks = await countClicks(button);

    await press(page, 'Tab');
    await expect(button).toBeFocused();
    await press(page, 'Enter', 'Space');
    expect(await clicks()).toBe(2);
  });

  test('disabled buttons are skipped and loading buttons stay focusable but inert', async ({
    page,
  }) => {
    await gotoStory(page, 'primitives-button--disabled');
    await press(page, 'Tab');
    await expect(page.locator(':focus')).toHaveCount(0);

    await gotoStory(page, 'primitives-button--loading');
    const loading = page.locator('#storybook-root').getByRole('button').first();
    await press(page, 'Tab');
    await expect(loading).toBeFocused();
    await expect(loading).toHaveAttribute('aria-disabled', 'true');
  });
});

test.describe('Checkbox', () => {
  test('Space toggles it', async ({ page }) => {
    await gotoStory(page, 'forms-checkbox--default');
    const checkbox = page.getByRole('checkbox', { name: 'Remember me' });

    await press(page, 'Tab');
    await expect(checkbox).toBeFocused();
    await press(page, 'Space');
    await expect(checkbox).toBeChecked();
    await press(page, 'Space');
    await expect(checkbox).not.toBeChecked();
  });

  test('the select-all box updates every item', async ({ page }) => {
    await gotoStory(page, 'forms-checkbox--select-all');
    const all = page.getByRole('checkbox').first();
    const items = page.getByRole('checkbox');

    await press(page, 'Tab', 'Space');
    await expect(all).toBeFocused();
    for (const item of await items.all()) await expect(item).toBeChecked();
    await press(page, 'Space');
    for (const item of await items.all()) await expect(item).not.toBeChecked();
  });
});

test.describe('Switch', () => {
  test('Space toggles it', async ({ page }) => {
    await gotoStory(page, 'forms-switch--default');
    const control = page.getByRole('switch', { name: 'Email notifications' });

    await press(page, 'Tab');
    await expect(control).toBeFocused();
    await press(page, 'Space');
    await expect(control).toBeChecked();
    await press(page, 'Space');
    await expect(control).not.toBeChecked();
  });
});

test.describe('RadioGroup', () => {
  test('Tab enters on the checked radio and arrows move the selection, skipping disabled', async ({
    page,
  }) => {
    await gotoStory(page, 'forms-radiogroup--default');
    const standard = page.getByRole('radio', { name: /Standard/ });
    const express = page.getByRole('radio', { name: /Express/ });

    await press(page, 'Tab');
    await expect(standard).toBeFocused();
    await press(page, 'ArrowDown');
    await expect(express).toBeFocused();
    await expect(express).toBeChecked();
    await press(page, 'ArrowDown');
    await expect(standard).toBeFocused();
    await expect(standard).toBeChecked();
    await press(page, 'ArrowUp');
    await expect(express).toBeChecked();

    await press(page, 'Tab');
    await expect(page.getByRole('radio').and(page.locator(':focus'))).toHaveCount(0);
    await press(page, 'Shift+Tab');
    await expect(express).toBeFocused();
  });

  test('horizontal groups use Left and Right', async ({ page }) => {
    await gotoStory(page, 'forms-radiogroup--horizontal');
    await press(page, 'Tab', 'ArrowRight');
    await expect(page.getByRole('radio', { name: 'Large' })).toBeChecked();
    await press(page, 'ArrowLeft', 'ArrowLeft');
    await expect(page.getByRole('radio', { name: 'Small' })).toBeChecked();
  });

  test('with nothing selected, Tab lands on the first radio and Space selects it', async ({
    page,
  }) => {
    await gotoStory(page, 'forms-radiogroup--with-description-and-error');
    const standard = page.getByRole('radio', { name: /Standard/ });

    await press(page, 'Tab');
    await expect(standard).toBeFocused();
    await expect(standard).not.toBeChecked();
    await press(page, 'Space');
    await expect(standard).toBeChecked();
  });
});

test.describe('FormField', () => {
  test('submitting an invalid form moves focus to the field, already described by its error', async ({
    page,
  }) => {
    await gotoStory(page, 'forms-formfield--validation');
    const field = page.getByRole('textbox', { name: 'Email' });

    await press(page, 'Tab', 'Tab', 'Enter');
    await expect(field).toBeFocused();
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveAccessibleDescription(/Enter a valid email address/);
  });
});

test.describe('Select', () => {
  test('arrow keys change the option without a pointer', async ({ page }) => {
    await gotoStory(page, 'forms-select--states');
    const select = page.getByRole('combobox', { name: 'Selected' });

    await press(page, 'Tab');
    await expect(select).toBeFocused();
    await press(page, 'ArrowDown');
    await expect(select).toHaveValue('cherry');
    await press(page, 'ArrowUp', 'ArrowUp');
    await expect(select).toHaveValue('apple');
  });
});

test.describe('Slider', () => {
  test('arrows step the value and Home/End jump to the limits', async ({ page }) => {
    await gotoStory(page, 'forms-slider--default');
    const slider = page.getByRole('slider', { name: 'Volume' });

    await press(page, 'Tab');
    await expect(slider).toBeFocused();
    await press(page, 'ArrowRight', 'ArrowUp');
    await expect(slider).toHaveValue('42');
    await press(page, 'ArrowLeft', 'ArrowDown', 'ArrowDown');
    await expect(slider).toHaveValue('39');
    await press(page, 'End');
    await expect(slider).toHaveValue('100');
    await press(page, 'Home');
    await expect(slider).toHaveValue('0');
  });

  test('the formatted value follows the keyboard', async ({ page }) => {
    await gotoStory(page, 'forms-slider--formatted-value');
    const slider = page.getByRole('slider', { name: 'Price limit' });

    await press(page, 'Tab', 'ArrowRight');
    await expect(slider).toHaveValue('300');
    await expect(slider).toHaveAttribute('aria-valuetext', '$300');
    await expect(page.locator('#storybook-root')).toContainText('$300');
  });
});

test.describe('Tabs', () => {
  test('automatic activation: arrows move and select, skipping disabled tabs', async ({ page }) => {
    await gotoStory(page, 'navigation-tabs--line');
    const tab = (name: string) => page.getByRole('tab', { name });

    await press(page, 'Tab');
    await expect(tab('Overview')).toBeFocused();
    await press(page, 'ArrowRight');
    await expect(tab('Activity')).toBeFocused();
    await expect(tab('Activity')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('last 30 days');
    await press(page, 'ArrowRight', 'ArrowRight');
    await expect(tab('Overview')).toBeFocused();
    await press(page, 'ArrowLeft');
    await expect(tab('Settings')).toBeFocused();
    await press(page, 'Home');
    await expect(tab('Overview')).toBeFocused();
    await press(page, 'End');
    await expect(tab('Settings')).toBeFocused();

    await press(page, 'Tab');
    await expect(page.getByRole('tabpanel')).toBeFocused();
    await press(page, 'Shift+Tab');
    await expect(tab('Settings')).toBeFocused();
  });

  test('vertical tabs use Up and Down', async ({ page }) => {
    await gotoStory(page, 'navigation-tabs--vertical');
    await press(page, 'Tab', 'ArrowRight');
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeFocused();
    await press(page, 'ArrowDown');
    await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused();
    await press(page, 'ArrowUp');
    await expect(page.getByRole('tab', { name: 'Overview' })).toBeFocused();
  });

  test('manual activation: arrows only move focus, Enter and Space select', async ({ page }) => {
    await gotoStory(page, 'navigation-tabs--manual-activation');
    const tab = (name: string) => page.getByRole('tab', { name });

    await press(page, 'Tab', 'ArrowRight');
    await expect(tab('Activity')).toBeFocused();
    await expect(tab('Overview')).toHaveAttribute('aria-selected', 'true');
    await press(page, 'Enter');
    await expect(tab('Activity')).toHaveAttribute('aria-selected', 'true');
    await press(page, 'ArrowRight', 'Space');
    await expect(tab('Settings')).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('Accordion', () => {
  test('Enter and Space toggle sections and arrows move between headers', async ({ page }) => {
    await gotoStory(page, 'navigation-accordion--single');
    const trigger = (name: string | RegExp) => page.getByRole('button', { name });

    await press(page, 'Tab');
    await expect(trigger(/shipping/)).toBeFocused();
    await expect(trigger(/shipping/)).toHaveAttribute('aria-expanded', 'true');
    await press(page, 'Enter');
    await expect(trigger(/shipping/)).toHaveAttribute('aria-expanded', 'false');

    await press(page, 'ArrowDown');
    await expect(trigger(/return/)).toBeFocused();
    await press(page, 'Space');
    await expect(trigger(/return/)).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('region', { name: /return/ })).toBeVisible();

    await press(page, 'End');
    await expect(trigger(/support/)).toBeFocused();
    await press(page, 'ArrowDown');
    await expect(trigger(/shipping/)).toBeFocused();
    await press(page, 'ArrowUp');
    await expect(trigger(/support/)).toBeFocused();
    await press(page, 'Home');
    await expect(trigger(/shipping/)).toBeFocused();
  });

  test('disabled sections are skipped', async ({ page }) => {
    await gotoStory(page, 'navigation-accordion--disabled-item');
    await press(page, 'Tab', 'ArrowDown', 'ArrowDown');
    await expect(page.getByRole('button', { name: /support/ })).toBeFocused();
  });
});

test.describe('DropdownMenu', () => {
  const item = (page: Page, name: string) => page.getByRole('menuitem', { name });

  test('opens from the keyboard and moves with arrows, Home and End', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    const trigger = page.getByRole('button', { name: 'Options' });

    await press(page, 'Tab');
    await expect(trigger).toBeFocused();
    await press(page, 'ArrowDown');
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(item(page, 'Edit')).toBeFocused();
    await press(page, 'ArrowDown', 'ArrowDown');
    await expect(item(page, 'Move to folder')).toBeFocused();
    await press(page, 'End');
    await expect(item(page, 'Delete')).toBeFocused();
    await press(page, 'ArrowDown');
    await expect(item(page, 'Edit')).toBeFocused();
    await press(page, 'ArrowUp');
    await expect(item(page, 'Delete')).toBeFocused();
    await press(page, 'Home');
    await expect(item(page, 'Edit')).toBeFocused();

    await press(page, 'Escape');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await press(page, 'ArrowUp');
    await expect(item(page, 'Delete')).toBeFocused();
  });

  test('Enter and Space open it from the trigger', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    await press(page, 'Tab', 'Enter');
    await expect(item(page, 'Edit')).toBeFocused();
    await press(page, 'Escape', 'Space');
    await expect(item(page, 'Edit')).toBeFocused();
  });

  test('typeahead focuses the next item starting with the typed text', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    await press(page, 'Tab', 'ArrowDown');

    await press(page, 'd');
    await expect(item(page, 'Duplicate')).toBeFocused();
    await press(page, 'd');
    await expect(item(page, 'Delete')).toBeFocused();
    await page.waitForTimeout(600);
    await page.keyboard.type('op');
    await expect(item(page, 'Open in new tab')).toBeFocused();
    await page.waitForTimeout(600);
    await page.keyboard.type('mo');
    await expect(item(page, 'Move to folder')).toBeFocused();
  });

  test('Enter and Space choose an item, but not a disabled one', async ({ page }) => {
    await gotoStory(page, 'overlays-dropdownmenu--default');
    const trigger = page.getByRole('button', { name: 'Options' });

    await press(page, 'Tab', 'ArrowDown', 'Enter');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await press(page, 'ArrowDown', 'ArrowDown', 'Space');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(trigger).toBeFocused();

    await press(page, 'ArrowDown', 'ArrowDown', 'ArrowDown');
    await expect(item(page, 'Move to folder')).toHaveAttribute('aria-disabled', 'true');
    await press(page, 'Enter');
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(item(page, 'Move to folder')).toBeFocused();
  });
});

test.describe('Pagination', () => {
  test('pages are reachable with Tab and change with Enter', async ({ page }) => {
    await gotoStory(page, 'navigation-pagination--controlled');
    const previous = page.getByRole('button', { name: /previous/i });
    const current = page.locator('[aria-current="page"]');

    await press(page, 'Tab');
    await expect(previous).toBeFocused();
    await press(page, 'Enter');
    await expect(current).toHaveText('3');
    await expect(page.locator('#storybook-root')).toContainText('Showing results 21–30');

    await press(page, 'Tab', 'Tab', 'Space');
    await expect(current).toHaveText('2');
  });
});

test.describe('Table', () => {
  test('sortable headers toggle with Enter and Space', async ({ page }) => {
    await gotoStory(page, 'data-display-table--default');
    const header = page.getByRole('columnheader', { name: /Invoice/ });
    const button = header.getByRole('button');

    await press(page, 'Tab');
    await expect(button).toBeFocused();
    await press(page, 'Enter');
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await press(page, 'Space');
    await expect(header).toHaveAttribute('aria-sort', 'descending');
  });
});

test.describe('Alert', () => {
  test('the dismiss button works from the keyboard', async ({ page }) => {
    await gotoStory(page, 'feedback-alert--dismissible');
    const dismiss = page.locator('#storybook-root').getByRole('button');
    const clicks = await countClicks(dismiss);

    await press(page, 'Tab');
    await expect(dismiss).toBeFocused();
    await press(page, 'Enter');
    expect(await clicks()).toBe(1);
  });
});

test.describe('Toast', () => {
  test('F8 reaches the newest toast, Escape dismisses it and focus goes back', async ({ page }) => {
    await gotoStory(page, 'feedback-toast--with-action');
    const trigger = page.locator('#storybook-root').getByRole('button').first();

    await press(page, 'Tab', 'Enter');
    const toast = page.locator('[data-toast]');
    await expect(toast).toHaveCount(1);
    await expect(trigger).toBeFocused();

    await press(page, 'F8');
    await expect(toast).toBeFocused();
    await press(page, 'Tab');
    await expect(toast.getByRole('button', { name: 'Undo' })).toBeFocused();
    await press(page, 'Escape');
    await expect(page.locator('[data-toast]', { hasText: 'Message archived' })).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});
