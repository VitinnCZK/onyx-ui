import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Spinner } from '../Spinner';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** @default 'primary' */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  /**
   * Shows a spinner and ignores clicks while keeping the button focusable and its width stable.
   * @default false
   */
  loading?: boolean;
  /**
   * Added to the accessible name while `loading`.
   * @default 'Loading'
   */
  loadingLabel?: string;
  /** Element rendered before the label, usually an icon. */
  startIcon?: ReactNode;
  /** Element rendered after the label, usually an icon. */
  endIcon?: ReactNode;
  /**
   * Stretches the button to the width of its container.
   * @default false
   */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    loadingLabel = 'Loading',
    startIcon,
    endIcon,
    fullWidth = false,
    type = 'button',
    className,
    children,
    onClick,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-disabled={loading || undefined}
      data-loading={loading || undefined}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
      )}
      onClick={(event) => {
        if (loading) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      <span className={styles.content}>
        {startIcon}
        {children}
        {endIcon}
      </span>
      {loading && (
        <>
          <Spinner decorative size="inherit" className={styles.spinner} />{' '}
          <VisuallyHidden>{loadingLabel}</VisuallyHidden>
        </>
      )}
    </button>
  );
});
