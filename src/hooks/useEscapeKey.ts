import { useEffect } from 'react';
import { useLatestRef } from './useLatestRef';

export interface UseEscapeKeyOptions {
  /** @default true */
  enabled?: boolean;
}

const layers: object[] = [];

/**
 * Calls `onEscape` when Escape is pressed. With several enabled at once, only the most recently
 * enabled one responds, so nested overlays close one at a time.
 */
export function useEscapeKey(
  onEscape: (event: KeyboardEvent) => void,
  { enabled = true }: UseEscapeKeyOptions = {},
): void {
  const onEscapeRef = useLatestRef(onEscape);

  useEffect(() => {
    if (!enabled) return;

    const layer = {};
    layers.push(layer);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.isComposing || event.defaultPrevented) return;
      if (layers.at(-1) === layer) onEscapeRef.current(event);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      layers.splice(layers.indexOf(layer), 1);
    };
  }, [enabled, onEscapeRef]);
}
