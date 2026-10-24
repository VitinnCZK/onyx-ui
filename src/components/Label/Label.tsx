import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Label.module.css';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * Shows a required marker. The marker is visual only: set `required` on the control too, so
   * assistive technology announces it.
   * @default false
   */
  required?: boolean;
  /** @default false */
  disabled?: boolean;
  /** @default 'md' */
  size?: 'sm' | 'md';
}

/** Caption of a form control. Associate it with `htmlFor` or by wrapping the control. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required = false, disabled = false, size = 'md', className, children, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      data-disabled={disabled || undefined}
      className={cn(styles.label, styles[size], className)}
      {...props}
    >
      {children}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
});
