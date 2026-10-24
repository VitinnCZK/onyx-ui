import {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useControllableState } from '@/hooks/useControllableState';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { getTabbable } from '@/hooks/useFocusTrap';
import { useLatestRef } from '@/hooks/useLatestRef';
import { cn } from '@/utils/cn';
import { useFloatingLayer, type Placement } from '@/utils/floating';
import { getElementRef } from '@/utils/getElementRef';
import { mergeRefs } from '@/utils/mergeRefs';
import { refocusIfLost } from '@/utils/refocusIfLost';
import { CloseIcon } from '../Icon';
import { IconButton } from '../IconButton';
import styles from './Popover.module.css';

export type PopoverPlacement = Placement;

export interface PopoverProps {
  /** Element that toggles the popover, usually a `Button`. It must accept a ref. */
  trigger: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
  /** Content of the popover. It can be interactive. */
  children: ReactNode;
  /** Heading that names the popover. Without it, pass `aria-label`. */
  title?: ReactNode;
  /** Accessible name when there is no `title`. */
  'aria-label'?: string;
  /** @default 'bottom-start' */
  placement?: PopoverPlacement;
  /** Open state, for a controlled popover. */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element focused on open. Defaults to the first focusable element, then the popover. */
  initialFocus?: RefObject<HTMLElement | null>;
  /**
   * Shows a close button in the corner.
   * @default false
   */
  showClose?: boolean;
  /**
   * Accessible name of the close button.
   * @default 'Close'
   */
  closeLabel?: string;
  /**
   * Gap between the trigger and the popover, in pixels.
   * @default 8
   */
  offset?: number;
  /** Class of the popover panel. */
  className?: string;
}

/**
 * Non-modal dialog anchored to a trigger. Focus moves into it on open; Escape, a click outside
 * or tabbing out closes it, and Escape returns focus to the trigger.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    trigger,
    children,
    title,
    'aria-label': ariaLabel,
    placement = 'bottom-start',
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    initialFocus,
    showClose = false,
    closeLabel = 'Close',
    offset = 8,
    className,
  },
  ref,
) {
  const id = useId();
  const contentId = `${id}-content`;
  const titleId = `${id}-title`;
  const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { setReference, setFloating, floatingStyles, side } = useFloatingLayer({
    open,
    placement,
    gap: offset,
  });
  const triggerElementRef = isValidElement(trigger)
    ? getElementRef<HTMLElement>(trigger)
    : undefined;
  const attachTrigger = useMemo(
    () => mergeRefs<HTMLElement>(setReference, triggerElementRef, setTriggerNode),
    [setReference, triggerElementRef],
  );
  const attachPanel = useMemo(() => mergeRefs(setFloating, panel, ref), [setFloating, ref]);
  const hasTitle = title !== undefined && title !== null;

  const setOpenLatest = useLatestRef(setOpen);

  useEffect(() => {
    const node = panel.current;
    if (!open || !node) return;

    (initialFocus?.current ?? getTabbable(node)[0] ?? node).focus();

    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (next && !node.contains(next) && next !== triggerNode) {
        setOpenLatest.current(false);
      }
    };
    node.addEventListener('focusout', onFocusOut);
    return () => node.removeEventListener('focusout', onFocusOut);
  }, [open, initialFocus, setOpenLatest, triggerNode]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerNode?.focus();
  };

  useEscapeKey(() => close(true), { enabled: open });
  useClickOutside(
    [panel, { current: triggerNode }],
    () => {
      close(false);
      refocusIfLost(triggerNode);
    },
    { enabled: open },
  );

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: attachTrigger,
        'aria-haspopup': 'dialog',
        'aria-expanded': open,
        'aria-controls': open ? contentId : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (!event.defaultPrevented) setOpen(!open);
        },
      } as object)
    : trigger;

  return (
    <>
      {triggerElement}
      {open && (
        <div
          ref={attachPanel}
          id={contentId}
          role="dialog"
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-label={hasTitle ? undefined : ariaLabel}
          tabIndex={-1}
          data-side={side}
          className={cn(styles.popover, className)}
          style={floatingStyles}
        >
          {(hasTitle || showClose) && (
            <div className={styles.header}>
              {hasTitle && (
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
              )}
              {showClose && (
                <IconButton
                  label={closeLabel}
                  size="sm"
                  className={styles.close}
                  onClick={() => close(true)}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </div>
          )}
          <div className={styles.body}>{children}</div>
        </div>
      )}
    </>
  );
});
