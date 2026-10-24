import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useScrollLock } from './useScrollLock';

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.removeAttribute('style');
  });

  it('hides the body overflow while enabled and restores it afterwards', () => {
    document.body.style.overflow = 'scroll';
    const { rerender, unmount } = renderHook(({ enabled }) => useScrollLock({ enabled }), {
      initialProps: { enabled: true },
    });

    expect(document.body.style.overflow).toBe('hidden');

    rerender({ enabled: false });
    expect(document.body.style.overflow).toBe('scroll');

    rerender({ enabled: true });
    unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('keeps the page locked until the last lock is released', () => {
    const first = renderHook(() => useScrollLock());
    const second = renderHook(() => useScrollLock());

    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');

    second.unmount();
    expect(document.body.style.overflow).toBe('');
  });
});
