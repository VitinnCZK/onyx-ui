import { useEffect } from 'react';

export interface UseScrollLockOptions {
  /** @default true */
  enabled?: boolean;
}

let locks = 0;
let restore: (() => void) | undefined;

function lock() {
  const { body, documentElement } = document;
  const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
  const { overflow, paddingRight } = body.style;
  const currentPadding = parseFloat(getComputedStyle(body).paddingRight) || 0;

  body.style.overflow = 'hidden';
  if (scrollbarWidth > 0) body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;

  return () => {
    body.style.overflow = overflow;
    body.style.paddingRight = paddingRight;
  };
}

/**
 * Stops the page from scrolling while enabled, keeping the layout from shifting when the
 * scrollbar disappears. Several locks can be active at once; the page scrolls again after the
 * last one is released.
 */
export function useScrollLock({ enabled = true }: UseScrollLockOptions = {}): void {
  useEffect(() => {
    if (!enabled) return;

    if (locks++ === 0) restore = lock();
    return () => {
      if (--locks === 0) restore?.();
    };
  }, [enabled]);
}
