import { afterEach, describe, expect, it } from 'vitest';
import { refocusIfLost } from '@/utils/refocusIfLost';

const nextTask = () => new Promise((resolve) => setTimeout(resolve));

function addButton() {
  const button = document.createElement('button');
  document.body.append(button);
  return button;
}

describe('refocusIfLost', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('focuses the element after the current event when focus fell to the body', async () => {
    const trigger = addButton();

    refocusIfLost(trigger);
    expect(trigger).not.toHaveFocus();

    await nextTask();
    expect(trigger).toHaveFocus();
  });

  it('leaves focus where it is when something else took it', async () => {
    const trigger = addButton();
    const other = addButton();

    refocusIfLost(trigger);
    other.focus();

    await nextTask();
    expect(other).toHaveFocus();
  });

  it('ignores elements that are no longer in the document', async () => {
    const trigger = addButton();

    refocusIfLost(trigger);
    trigger.remove();

    await nextTask();
    expect(document.body).toHaveFocus();
  });
});
