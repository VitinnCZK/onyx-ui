import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Spinner.module.css';

export type SpinnerSize = 'inherit' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * `inherit` follows the font size of the surrounding text.
   * @default 'md'
   */
  size?: SpinnerSize;
  /**
   * Text announced to assistive technology.
   * @default 'Loading'
   */
  label?: string;
  /**
   * Hides the spinner from assistive technology, for when something else (such as a busy button)
   * already conveys the loading state.
   * @default false
   */
  decorative?: boolean;
}

/** Indeterminate loading indicator, announced as a status message unless decorative. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = 'md', label = 'Loading', decorative = false, className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      className={cn(styles.spinner, styles[size], className)}
      {...props}
    >
      <svg className={styles.svg} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle className={styles.track} cx="12" cy="12" r="10" />
        <path className={styles.arc} d="M12 2a10 10 0 0 1 10 10" />
      </svg>
      {!decorative && <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  );
});
