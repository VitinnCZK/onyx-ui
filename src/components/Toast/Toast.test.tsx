import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { ToastProvider, useToast, type ToastContextValue, type ToastProviderProps } from '.';

function setup(props: Partial<ToastProviderProps> = {}) {
  let api!: ToastContextValue;
  function Capture() {
    api = useToast();
    return null;
  }
  render(
    <ToastProvider {...props}>
      <Capture />
    </ToastProvider>,
  );
  return {
    toast: (...args: Parameters<ToastContextValue['toast']>) => {
      let id = '';
      act(() => {
        id = api.toast(...args);
      });
      return id;
    },
    dismiss: (...args: Parameters<ToastContextValue['dismiss']>) => act(() => api.dismiss(...args)),
  };
}

const region = () => screen.getByRole('region', { name: 'Notifications' });
const items = () => within(region()).queryAllByRole('listitem');

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a labelled polite live region before any toast appears', () => {
    setup();

    expect(region().querySelector('ol')).toHaveAttribute('aria-live', 'polite');
    expect(items()).toHaveLength(0);
  });

  it('shows the title and description of a toast', () => {
    const { toast } = setup();

    toast({ title: 'Saved', description: 'Your changes are live.' });

    expect(items()).toHaveLength(1);
    expect(items()[0]).toHaveTextContent('SavedYour changes are live.');
  });

  it('closes on its own after the duration', () => {
    const onDismiss = vi.fn();
    const { toast } = setup({ duration: 3000 });

    toast({ title: 'Saved', onDismiss });
    act(() => vi.advanceTimersByTime(2999));
    expect(items()).toHaveLength(1);

    act(() => vi.advanceTimersByTime(1));
    expect(items()).toHaveLength(0);
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('keeps a toast with a null duration open', () => {
    const { toast } = setup();

    toast({ title: 'Sticky', duration: null });
    act(() => vi.advanceTimersByTime(60_000));

    expect(items()).toHaveLength(1);
  });

  it('queues toasts beyond max and shows them as others close', () => {
    const { toast, dismiss } = setup({ max: 2 });

    const first = toast({ title: 'One', duration: null });
    toast({ title: 'Two', duration: null });
    toast({ title: 'Three', duration: null });
    expect(items().map((item) => item.textContent)).toEqual(['One', 'Two']);

    dismiss(first);
    expect(items().map((item) => item.textContent)).toEqual(['Two', 'Three']);
  });

  it('starts the timer of a queued toast only when it becomes visible', () => {
    const { toast } = setup({ max: 1, duration: 1000 });

    toast({ title: 'One' });
    toast({ title: 'Two' });
    act(() => vi.advanceTimersByTime(1000));
    expect(items().map((item) => item.textContent)).toEqual(['Two']);

    act(() => vi.advanceTimersByTime(999));
    expect(items()).toHaveLength(1);
    act(() => vi.advanceTimersByTime(1));
    expect(items()).toHaveLength(0);
  });

  it('pauses the timers while hovered or focused', () => {
    const { toast } = setup({ duration: 1000 });
    toast({ title: 'Saved' });
    const list = region().querySelector('ol')!;

    act(() => vi.advanceTimersByTime(600));
    fireEvent.pointerEnter(list);
    act(() => vi.advanceTimersByTime(5000));
    expect(items()).toHaveLength(1);

    fireEvent.pointerLeave(list);
    act(() => vi.advanceTimersByTime(399));
    expect(items()).toHaveLength(1);
    act(() => vi.advanceTimersByTime(1));
    expect(items()).toHaveLength(0);

    toast({ title: 'Focused' });
    fireEvent.focus(items()[0]!);
    act(() => vi.advanceTimersByTime(5000));
    expect(items()).toHaveLength(1);
  });

  it('runs the action and closes the toast', () => {
    const onClick = vi.fn();
    const { toast } = setup();

    toast({ title: 'Deleted', action: { label: 'Undo', onClick }, duration: null });
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(items()).toHaveLength(0);
  });

  it('closes with the dismiss button and with Escape', () => {
    const { toast } = setup({ dismissLabel: 'Close' });

    toast({ title: 'One', duration: null });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(items()).toHaveLength(0);

    toast({ title: 'Two', duration: null });
    fireEvent.keyDown(items()[0]!, { key: 'Escape' });
    expect(items()).toHaveLength(0);
  });

  it('focuses the newest toast with the hotkey', () => {
    const { toast } = setup();

    toast({ title: 'One', duration: null });
    toast({ title: 'Two', duration: null });
    fireEvent.keyDown(document, { key: 'F8' });

    expect(items()[1]).toHaveFocus();
  });

  it('returns focus to where it was when the focused toast closes', () => {
    const { toast } = setup();
    const before = document.createElement('button');
    document.body.append(before);
    before.focus();

    toast({ title: 'One', duration: null });
    toast({ title: 'Two', duration: null });
    fireEvent.keyDown(document, { key: 'F8' });
    fireEvent.keyDown(items()[1]!, { key: 'Escape' });

    expect(items()).toHaveLength(1);
    expect(before).toHaveFocus();
    before.remove();
  });

  it('moves focus to the next toast when there is nowhere to go back to', () => {
    const { toast } = setup();

    toast({ title: 'One', duration: null });
    toast({ title: 'Two', duration: null });
    act(() => items()[1]!.focus());
    fireEvent.keyDown(items()[1]!, { key: 'Escape' });

    expect(items()[0]).toHaveFocus();
  });

  it('keeps closing toasts on time after the focused one is dismissed', () => {
    const { toast } = setup({ duration: 3000 });
    const before = document.createElement('button');
    document.body.append(before);
    before.focus();

    toast({ title: 'One' });
    toast({ title: 'Two', duration: null });
    fireEvent.keyDown(document, { key: 'F8' });
    fireEvent.keyDown(items()[1]!, { key: 'Escape' });
    act(() => vi.advanceTimersByTime(3000));

    expect(items()).toHaveLength(0);
    before.remove();
  });

  it('announces danger toasts assertively', () => {
    const { toast } = setup();

    toast({ title: 'Upload failed', intent: 'danger' });

    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed');
  });

  it('replaces a toast that reuses an id and dismisses all at once', () => {
    const { toast, dismiss } = setup();

    toast({ id: 'upload', title: 'Uploading…', duration: null });
    toast({ id: 'upload', title: 'Uploaded', duration: null });
    toast({ title: 'Other', duration: null });
    expect(items().map((item) => item.textContent)).toEqual(['Uploaded', 'Other']);

    dismiss();
    expect(items()).toHaveLength(0);
  });

  it('throws when useToast is used outside a provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => renderHook(() => useToast())).toThrow(/inside a ToastProvider/);
    vi.restoreAllMocks();
  });

  it('has no accessibility violations', async () => {
    vi.useRealTimers();
    const { toast } = setup();

    toast({ title: 'Saved', description: 'All good.', intent: 'success', duration: null });
    toast({ title: 'Deleted', action: { label: 'Undo', onClick: () => {} }, duration: null });

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
