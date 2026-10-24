import { useEffect, type RefObject } from 'react';
import { useLatestRef } from './useLatestRef';

export interface UseClickOutsideOptions {
  /** @default true */
  enabled?: boolean;
}

/**
 * Calls `onClickOutside` when a pointer is pressed outside every element in `refs`. Include the
 * element that toggles the layer, or pressing it closes and reopens the layer.
 */
export function useClickOutside(
  refs: RefObject<Element | null> | readonly RefObject<Element | null>[],
  onClickOutside: (event: PointerEvent) => void,
  { enabled = true }: UseClickOutsideOptions = {},
): void {
  const refsRef = useLatestRef(refs);
  const onClickOutsideRef = useLatestRef(onClickOutside);

  useEffect(() => {
    if (!enabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const path = event.composedPath();
      const inside = [refsRef.current]
        .flat()
        .some(({ current }) => current !== null && path.includes(current));

      if (!inside) onClickOutsideRef.current(event);
    };

    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [enabled, refsRef, onClickOutsideRef]);
}
