import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../Icon';
import { IconButton } from '../IconButton';
import styles from './Alert.module.css';

export type AlertIntent = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** @default 'info' */
  intent?: AlertIntent;
  /** @default 'subtle' */
  variant?: 'subtle' | 'solid';
  /** Short summary shown in bold above the content. */
  title?: ReactNode;
  /** Replaces the intent icon. `false` hides it. */
  icon?: ReactNode;
  /** Controls placed after the content, such as a button or a link. */
  action?: ReactNode;
  /** Shows a dismiss button that calls this function. */
  onDismiss?: () => void;
  /**
   * Accessible name of the dismiss button.
   * @default 'Dismiss'
   */
  dismissLabel?: string;
}

const icons: Record<AlertIntent, ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger: <ErrorIcon />,
};

/**
 * Highlighted message about the page or a task. Warnings and errors use `role="alert"`, so they
 * are announced as soon as they appear; the others use `role="status"`. Override with `role`.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    intent = 'info',
    variant = 'subtle',
    title,
    icon,
    action,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    ...props
  },
  ref,
) {
  const titleId = useId();
  const hasTitle = title !== undefined && title !== null;

  return (
    <div
      ref={ref}
      role={intent === 'warning' || intent === 'danger' ? 'alert' : 'status'}
      aria-labelledby={hasTitle ? titleId : undefined}
      className={cn(styles.alert, styles[intent], styles[variant], className)}
      {...props}
    >
      {icon !== false && (
        <span className={styles.icon} aria-hidden="true">
          {icon ?? icons[intent]}
        </span>
      )}
      <div className={styles.content}>
        {hasTitle && (
          <p id={titleId} className={styles.title}>
            {title}
          </p>
        )}
        {children !== undefined && <div className={styles.description}>{children}</div>}
        {action !== undefined && <div className={styles.action}>{action}</div>}
      </div>
      {onDismiss && (
        <IconButton label={dismissLabel} size="sm" className={styles.dismiss} onClick={onDismiss}>
          <CloseIcon />
        </IconButton>
      )}
    </div>
  );
});
