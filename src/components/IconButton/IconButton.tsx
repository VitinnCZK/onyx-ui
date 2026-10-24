import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Button, type ButtonProps } from '../Button';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<
  ButtonProps,
  'startIcon' | 'endIcon' | 'fullWidth' | 'children' | 'aria-label'
> {
  /** Accessible name. Required because the button has no visible text. */
  label: string;
  /** The icon. It is hidden from assistive technology; `label` names the button. */
  children: ReactNode;
  /** @default 'ghost' */
  variant?: ButtonProps['variant'];
}

/** Square button that shows only an icon. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'ghost', size = 'md', className, children, ...props },
  ref,
) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      aria-label={label}
      className={cn(styles.iconButton, styles[size], className)}
      {...props}
    >
      <span className={styles.icon} aria-hidden="true">
        {children}
      </span>
    </Button>
  );
});
