import {
  cloneElement,
  isValidElement,
  useId,
  useMemo,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useTimeout } from '@/hooks/useTimeout';
import { cn } from '@/utils/cn';
import { useFloatingLayer, type Placement } from '@/utils/floating';
import { getElementRef } from '@/utils/getElementRef';
import { mergeRefs } from '@/utils/mergeRefs';
import { Portal } from '../Portal';
import styles from './Tooltip.module.css';

export type TooltipPlacement = Placement;

interface TriggerProps {
  'aria-describedby'?: string;
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
}

export interface TooltipProps {
  /** Text shown in the tooltip. Keep it short and never put interactive content in it. */
  content: ReactNode;
  /** The element that shows the tooltip. It must be focusable and accept a ref. */
  children: ReactElement;
  /** @default 'top' */
  placement?: TooltipPlacement;
  /**
   * Milliseconds the pointer has to rest on the trigger before the tooltip opens. Keyboard focus
   * opens it right away.
   * @default 300
   */
  openDelay?: number;
  /**
   * Milliseconds before it closes after the pointer leaves, so it can be hovered.
   * @default 100
   */
  closeDelay?: number;
  /** Open state, for a controlled tooltip. */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Gap between the trigger and the tooltip, in pixels.
   * @default 8
   */
  offset?: number;
  /** @default false */
  disabled?: boolean;
  className?: string;
}

/**
 * Short description of an element, shown on hover and focus and linked with
 * `aria-describedby`. Escape closes it; moving the pointer onto it keeps it open.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  openDelay = 300,
  closeDelay = 100,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  offset = 8,
  disabled = false,
  className,
}: TooltipProps) {
  const id = useId();
  const timeout = useTimeout();
  const [openState, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const open = openState && !disabled;
  const { setReference, setFloating, floatingStyles, side } = useFloatingLayer({
    open,
    placement,
    gap: offset,
  });

  const childElementRef = isValidElement(children)
    ? getElementRef<HTMLElement>(children)
    : undefined;
  const attachTrigger = useMemo(
    () => mergeRefs(setReference, childElementRef),
    [setReference, childElementRef],
  );

  useEscapeKey(() => setOpen(false), { enabled: open });

  const schedule = (next: boolean, delay: number) => {
    timeout.clear();
    if (delay <= 0) setOpen(next);
    else timeout.set(() => setOpen(next), delay);
  };

  if (!isValidElement<TriggerProps>(children)) return children;

  const childProps = children.props;
  const trigger = cloneElement(children, {
    ref: attachTrigger,
    'aria-describedby': cn(childProps['aria-describedby'], !disabled && id) || undefined,
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerEnter?.(event);
      if (event.pointerType !== 'touch') schedule(true, openDelay);
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerLeave?.(event);
      schedule(false, closeDelay);
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event);
      schedule(true, 0);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event);
      schedule(false, 0);
    },
  } as TriggerProps & { ref: unknown });

  return (
    <>
      {trigger}
      {open ? (
        <Portal>
          <div
            ref={setFloating}
            id={id}
            role="tooltip"
            data-side={side}
            className={cn(styles.tooltip, className)}
            style={floatingStyles}
            onPointerEnter={timeout.clear}
            onPointerLeave={() => schedule(false, closeDelay)}
          >
            {content}
          </div>
        </Portal>
      ) : (
        !disabled && (
          <span id={id} hidden>
            {content}
          </span>
        )
      )}
    </>
  );
}
