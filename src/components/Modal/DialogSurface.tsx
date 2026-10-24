import { forwardRef, useId, useMemo, useRef, type ReactNode, type RefObject } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cn } from '@/utils/cn';
import { mergeRefs } from '@/utils/mergeRefs';
import { CloseIcon } from '../Icon';
import { IconButton } from '../IconButton';
import { Portal } from '../Portal';
import styles from './DialogSurface.module.css';

export interface DialogOptions {
  /** Heading of the dialog, which also names it. */
  title: ReactNode;
  /** Text below the title that describes the dialog, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Content of the dialog. */
  children?: ReactNode;
  /** Actions shown at the bottom, usually buttons. */
  footer?: ReactNode;
  /**
   * Use `alertdialog` for urgent confirmations that need an answer.
   * @default 'dialog'
   */
  role?: 'dialog' | 'alertdialog';
  /** @default true */
  closeOnOverlayClick?: boolean;
  /** @default true */
  closeOnEscape?: boolean;
  /** Element focused on open. Defaults to the first focusable element. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** @default false */
  hideCloseButton?: boolean;
  /**
   * Accessible name of the close button.
   * @default 'Close'
   */
  closeLabel?: string;
  /** Class of the dialog panel. */
  className?: string;
}

interface DialogSurfaceProps extends DialogOptions {
  open: boolean;
  onClose: () => void;
  panelClassName?: string;
  rootClassName?: string;
}

export const DialogSurface = forwardRef<HTMLDivElement, DialogSurfaceProps>(function DialogSurface(
  {
    open,
    onClose,
    title,
    description,
    children,
    footer,
    role = 'dialog',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    initialFocus,
    hideCloseButton = false,
    closeLabel = 'Close',
    className,
    panelClassName,
    rootClassName,
  },
  ref,
) {
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const panel = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const attachPanel = useMemo(() => mergeRefs(panel, ref), [ref]);
  const hasDescription = description !== undefined && description !== null;

  useFocusTrap(panel, { enabled: open, initialFocus });
  useScrollLock({ enabled: open });
  useEscapeKey(onClose, { enabled: open && closeOnEscape });
  useClickOutside(
    panel,
    (event) => {
      if (event.target === backdrop.current) onClose();
    },
    { enabled: open && closeOnOverlayClick },
  );

  if (!open) return null;

  return (
    <Portal>
      <div className={cn(styles.root, rootClassName)}>
        <div ref={backdrop} className={styles.backdrop} aria-hidden="true" />
        <div
          ref={attachPanel}
          role={role}
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(styles.panel, panelClassName, className)}
        >
          <header className={styles.header}>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {!hideCloseButton && (
              <IconButton label={closeLabel} size="sm" className={styles.close} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </header>
          <div className={styles.body}>
            {hasDescription && (
              <p id={descriptionId} className={styles.description}>
                {description}
              </p>
            )}
            {children}
          </div>
          {footer !== undefined && <footer className={styles.footer}>{footer}</footer>}
        </div>
      </div>
    </Portal>
  );
});
