import { forwardRef, type CSSProperties, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import field from '@/styles/field.module.css';
import { useFieldControl } from '../FormField/formFieldContext';
import { ChevronDownIcon } from '../Icon';
import type { FieldSize } from '../Input';
import styles from './Select.module.css';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** @default 'md' */
  size?: FieldSize;
  /** Marks the value as invalid. Inside a `FormField`, defaults to whether it has an error. */
  invalid?: boolean;
  /**
   * Text of an empty first option, selected while nothing else is. It cannot be picked again, so
   * pair it with `required` or a reset action.
   */
  placeholder?: string;
  /** Class of the outer box. Other props go to the `<select>`. */
  className?: string;
  /** Style of the outer box. */
  style?: CSSProperties;
}

/** Native select, styled to match the other fields. Pass `<option>` and `<optgroup>` children. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    size = 'md',
    invalid,
    placeholder,
    className,
    style,
    id,
    disabled,
    required,
    multiple,
    value,
    defaultValue,
    'aria-describedby': describedBy,
    children,
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
  const usePlaceholder = placeholder !== undefined && !multiple;

  return (
    <div className={cn(styles.wrapper, className)} style={style}>
      <select
        ref={ref}
        id={control.id}
        disabled={control.disabled}
        required={control.required}
        multiple={multiple}
        value={value}
        defaultValue={usePlaceholder && value === undefined ? (defaultValue ?? '') : defaultValue}
        aria-invalid={control['aria-invalid']}
        aria-describedby={control['aria-describedby']}
        data-invalid={control.invalid || undefined}
        className={cn(field.control, field[size], styles.select, multiple && styles.multiple)}
        {...props}
      >
        {usePlaceholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {!multiple && <ChevronDownIcon className={styles.chevron} />}
    </div>
  );
});
