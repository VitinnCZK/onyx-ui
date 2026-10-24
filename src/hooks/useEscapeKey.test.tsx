import { fireEvent, renderHook } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useEscapeKey, type UseEscapeKeyOptions } from './useEscapeKey';

const setup = (onEscape: (event: KeyboardEvent) => void, options?: UseEscapeKeyOptions) =>
  renderHook((props) => useEscapeKey(props.onEscape, props.options), {
    initialProps: { onEscape, options },
  });

describe('useEscapeKey', () => {
  it('calls the handler when Escape is pressed', async () => {
    const onEscape = vi.fn();
    setup(onEscape);

    await userEvent.keyboard('{Escape}');

    expect(onEscape).toHaveBeenCalledOnce();
    expect(onEscape.mock.calls[0]?.[0]).toBeInstanceOf(KeyboardEvent);
  });

  it('ignores other keys', async () => {
    const onEscape = vi.fn();
    setup(onEscape);

    await userEvent.keyboard('{Enter}a');

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', async () => {
    const onEscape = vi.fn();
    setup(onEscape, { enabled: false });

    await userEvent.keyboard('{Escape}');

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('ignores Escape that ends an IME composition or was already handled', () => {
    const onEscape = vi.fn();
    setup(onEscape);

    fireEvent.keyDown(document, { key: 'Escape', isComposing: true });
    const handled = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
    handled.preventDefault();
    document.dispatchEvent(handled);

    expect(onEscape).not.toHaveBeenCalled();
  });

  it('calls the latest handler', async () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = setup(first);

    rerender({ onEscape: second, options: undefined });
    await userEvent.keyboard('{Escape}');

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('only calls the most recently enabled handler', async () => {
    const outer = vi.fn();
    const inner = vi.fn();
    setup(outer);
    const nested = setup(inner);

    await userEvent.keyboard('{Escape}');

    expect(inner).toHaveBeenCalledOnce();
    expect(outer).not.toHaveBeenCalled();

    nested.unmount();
    await userEvent.keyboard('{Escape}');

    expect(outer).toHaveBeenCalledOnce();
  });
});
