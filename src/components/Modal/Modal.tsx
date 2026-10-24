import {
  cloneElement,
  forwardRef,
  isValidElement,
  type MouseEvent,
  type ReactElement,
} from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/cn';
import { DialogSurface, type DialogOptions } from './DialogSurface';
import styles from './Modal.module.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface DialogStateProps {
  /** Open state, for a controlled dialog. */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  /** Called when the dialog asks to open or close. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Element that opens the dialog when clicked, usually a `Button`. Focus returns to it when the
   * dialog closes. Leave it out to control `open` yourself.
   */
  trigger?: ReactElement<{ onClick?: (event: MouseEvent<HTMLElement>) => void }>;
}

export interface ModalProps extends DialogOptions, DialogStateProps {
  /** @default 'md' */
  size?: ModalSize;
}

export function useDialogState({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger,
}: DialogStateProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        'aria-haspopup': 'dialog',
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (!event.defaultPrevented) setOpen(true);
        },
      } as object)
    : null;

  return { isOpen, close: () => setOpen(false), triggerElement };
}

/**
 * Dialog centered over the page. Focus moves into it and stays there, the page behind stops
 * scrolling, and focus returns to the element that opened it on close.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  { open, defaultOpen, onOpenChange, trigger, size = 'md', ...props },
  ref,
) {
  const { isOpen, close, triggerElement } = useDialogState({
    open,
    defaultOpen,
    onOpenChange,
    trigger,
  });

  return (
    <>
      {triggerElement}
      <DialogSurface
        ref={ref}
        open={isOpen}
        onClose={close}
        rootClassName={styles.root}
        panelClassName={cn(styles.panel, styles[size])}
        {...props}
      />
    </>
  );
});
