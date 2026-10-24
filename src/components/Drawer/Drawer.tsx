import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { DialogSurface, type DialogOptions } from '../Modal/DialogSurface';
import { useDialogState, type DialogStateProps } from '../Modal/Modal';
import styles from './Drawer.module.css';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

export interface DrawerProps extends DialogOptions, DialogStateProps {
  /**
   * Edge the drawer slides in from. `start` and `end` follow the writing direction.
   * @default 'end'
   */
  placement?: DrawerPlacement;
  /** Width, or height for `top` and `bottom`. @default 'sm' */
  size?: DrawerSize;
}

/**
 * Dialog attached to an edge of the screen, for navigation, filters or details. Behaves like
 * `Modal`: focus is trapped, the page stops scrolling and focus returns on close.
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { open, defaultOpen, onOpenChange, trigger, placement = 'end', size = 'sm', ...props },
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
        rootClassName={cn(styles.root, styles[placement])}
        panelClassName={cn(styles.panel, styles[size])}
        {...props}
      />
    </>
  );
});
