import { forwardRef, useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Progress.module.css';

export type ProgressIntent = 'primary' | 'success' | 'warning' | 'danger';

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Amount done, from 0 to `max`. Leave it out (or `null`) when the amount is unknown. */
  value?: number | null;
  /** @default 100 */
  max?: number;
  /** Visible caption that names the progress bar. Without it, use `aria-label`. */
  label?: ReactNode;
  /**
   * Shows the formatted value next to the label.
   * @default false
   */
  showValue?: boolean;
  /**
   * Turns the value into text for `aria-valuetext` and the visible value. Defaults to a
   * rounded percentage.
   */
  formatValue?: (value: number, max: number) => string;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** @default 'primary' */
  intent?: ProgressIntent;
  /** Class of the outer box. Other props go to the element with `role="progressbar"`. */
  className?: string;
}

const percent = (value: number, max: number) => `${Math.round((value / max) * 100)}%`;

/** Shows how much of a task is done, or that it is in progress when the amount is unknown. */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = null,
    max = 100,
    label,
    showValue = false,
    formatValue = percent,
    size = 'md',
    intent = 'primary',
    className,
    ...props
  },
  ref,
) {
  const labelId = useId();
  const indeterminate = value === null;
  const clamped = indeterminate ? 0 : Math.min(Math.max(value, 0), max);
  const valueText = indeterminate ? undefined : formatValue(clamped, max);
  const hasLabel = label !== undefined && label !== null;

  return (
    <div className={cn(styles.progress, styles[size], styles[intent], className)}>
      {(hasLabel || (showValue && valueText)) && (
        <div className={styles.header}>
          {hasLabel && (
            <span id={labelId} className={styles.label}>
              {label}
            </span>
          )}
          {showValue && valueText && (
            <span className={styles.value} aria-hidden="true">
              {valueText}
            </span>
          )}
        </div>
      )}
      <div
        ref={ref}
        role="progressbar"
        aria-labelledby={hasLabel ? labelId : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : clamped}
        aria-valuetext={valueText}
        data-indeterminate={indeterminate || undefined}
        className={styles.track}
        {...props}
      >
        <div
          className={styles.bar}
          style={
            indeterminate ? undefined : ({ '--progress-value': clamped / max } as CSSProperties)
          }
        />
      </div>
    </div>
  );
});
