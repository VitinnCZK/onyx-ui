import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Tooltip } from '.';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const focus = (element: HTMLElement) => act(() => element.focus());

  it('describes the trigger even while closed', () => {
    render(
      <Tooltip content="Copy to clipboard">
        <button type="button">Copy</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button')).toHaveAccessibleDescription('Copy to clipboard');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens on focus right away and closes on blur', () => {
    render(
      <Tooltip content="Copy to clipboard">
        <button type="button">Copy</button>
      </Tooltip>,
    );

    focus(screen.getByRole('button'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy to clipboard');
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Copy to clipboard');

    act(() => screen.getByRole('button').blur());
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('opens after the delay on hover and stays open while the tooltip is hovered', () => {
    render(
      <Tooltip content="Settings" openDelay={500} closeDelay={200}>
        <button type="button">⚙</button>
      </Tooltip>,
    );

    fireEvent.pointerEnter(screen.getByRole('button'));
    act(() => vi.advanceTimersByTime(499));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1));
    const tooltip = screen.getByRole('tooltip');

    fireEvent.pointerLeave(screen.getByRole('button'));
    fireEvent.pointerEnter(tooltip);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerLeave(tooltip);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('closes with Escape', () => {
    render(
      <Tooltip content="Delete">
        <button type="button">🗑</button>
      </Tooltip>,
    );

    focus(screen.getByRole('button'));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('keeps the handlers and the ref of the trigger', () => {
    const onFocus = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <Tooltip content="Help">
        <button type="button" ref={ref} onFocus={onFocus} aria-describedby="extra">
          ?
        </button>
      </Tooltip>,
    );

    focus(screen.getByRole('button'));

    expect(onFocus).toHaveBeenCalledOnce();
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current?.getAttribute('aria-describedby')).toMatch(/^extra /);
  });

  it('works as a controlled component and can be disabled', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Tooltip content="Info" open onOpenChange={onOpenChange}>
        <button type="button">i</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.blur(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    rerender(
      <Tooltip content="Info" open disabled>
        <button type="button">i</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-describedby');
  });

  it('has no accessibility violations while open', async () => {
    vi.useRealTimers();
    render(
      <main>
        <Tooltip content="Copy to clipboard" defaultOpen>
          <button type="button">Copy</button>
        </Tooltip>
      </main>,
    );

    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
