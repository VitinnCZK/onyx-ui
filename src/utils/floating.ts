import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from '@floating-ui/react-dom';

export type { Placement };

export interface UseFloatingLayerOptions {
  open: boolean;
  placement: Placement;
  /** Gap between the reference and the floating element, in pixels. */
  gap: number;
  /** Makes the floating element at least as wide as the reference. */
  matchWidth?: boolean;
}

const viewportPadding = 8;

/**
 * Positions a floating element next to a reference element, flipping and shifting it to stay in
 * the viewport and capping its height to the space available.
 */
export function useFloatingLayer({
  open,
  placement,
  gap,
  matchWidth = false,
}: UseFloatingLayerOptions) {
  const floating = useFloating({
    open,
    placement,
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(gap),
      flip({ padding: viewportPadding }),
      shift({ padding: viewportPadding }),
      size({
        padding: viewportPadding,
        apply({ availableHeight, rects, elements }) {
          elements.floating.style.maxHeight = `${Math.max(availableHeight, 0)}px`;
          if (matchWidth) elements.floating.style.minWidth = `${rects.reference.width}px`;
        },
      }),
    ],
  });

  return {
    setReference: floating.refs.setReference,
    setFloating: floating.refs.setFloating,
    floatingStyles: floating.floatingStyles,
    side: floating.placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left',
  };
}
