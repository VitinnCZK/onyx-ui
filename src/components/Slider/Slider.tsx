import { forwardRef, type CSSProperties, type InputHTMLAttributes } from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/cn';
import { useFieldControl } from '../FormField/formFieldContext';
import styles from './Slider.module.css';

export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'value' | 'defaultValue' | 'min' | 'max' | 'step'
> {
  /** Current value, for a controlled slider. */
  value?: number;
  /** Initial value, for an uncontrolled slider. Defaults to `min`. */
  defaultValue?: number;
  /** Called with the new value while the user drags or presses keys. */
  onValueChange?: (value: number) => void;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  /** @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Marks the value as invalid. Inside a `FormField`, defaults to whether it has an error. */
  invalid?: boolean;
  /**
   * Turns the value into readable text, used for `aria-valuetext` and the visible value,
   * e.g. `(value) => `${value}%``.
   */
  formatValue?: (value: number) => string;
  /**
   * Shows the formatted value next to the track.
   * @default false
   */
  showValue?: boolean;
  /** Class of the outer box. Other props go to the `<input>`. */
  className?: string;
  /** Style of the outer box. */
  style?: CSSProperties;
}

/**
 * Picks a number from a range. Built on the native range input, so arrow keys, Page Up/Down and
 * Home/End work as the ARIA slider pattern describes.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onValueChange,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    size = 'md',
    invalid,
    formatValue,
    showValue = false,
    className,
    style,
    id,
    disabled,
    required,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const control = useFieldControl({
    id,
    disabled,
    required,
    invalid,
    'aria-describedby': describedBy,
  });
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });
  const progress = max > min ? ((current - min) / (max - min)) * 100 : 0;
  const valueText = formatValue?.(current);

  return (
    <div
      className={cn(styles.slider, styles[size], className)}
      style={{ '--slider-progress': `${progress}%`, ...style } as CSSProperties}
    >
      <input
        ref={ref}
        type="range"
        id={control.id}
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={control.disabled}
        required={control.required}
        aria-invalid={control['aria-invalid']}
        aria-describedby={control['aria-describedby']}
        aria-valuetext={valueText}
        data-invalid={control.invalid || undefined}
        className={styles.input}
        onChange={(event) => {
          onChange?.(event);
          setCurrent(event.target.valueAsNumber);
        }}
        {...props}
      />
      {showValue && (
        <span className={styles.value} aria-hidden="true">
          {valueText ?? current}
        </span>
      )}
    </div>
  );
});
