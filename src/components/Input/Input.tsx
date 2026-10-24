import { forwardRef, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import field from '@/styles/field.module.css';
import { useFieldControl } from '../FormField/formFieldContext';
import styles from './Input.module.css';

export type FieldSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** @default 'md' */
  size?: FieldSize;
  /** Marks the value as invalid. Inside a `FormField`, defaults to whether it has an error. */
  invalid?: boolean;
  /** Element shown before the text, such as an icon or a prefix. */
  startAdornment?: ReactNode;
  /** Element shown after the text, such as an icon, a unit or a button. */
  endAdornment?: ReactNode;
  /** Class of the outer box, which draws the border. Other props go to the `<input>`. */
  className?: string;
  /** Style of the outer box. */
  style?: CSSProperties;
}

/** Single-line text field. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = 'md',
    invalid,
    startAdornment,
    endAdornment,
    className,
    style,
    type = 'text',
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

  return (
    <div
      className={cn(field.control, field[size], className)}
      style={style}
      data-invalid={control.invalid || undefined}
      data-disabled={control.disabled || undefined}
    >
      {startAdornment && <span className={field.adornment}>{startAdornment}</span>}
      <input
        ref={ref}
        type={type}
        id={control.id}
        disabled={control.disabled}
        required={control.required}
        aria-invalid={control['aria-invalid']}
        aria-describedby={control['aria-describedby']}
        className={styles.input}
        {...props}
      />
      {endAdornment && <span className={field.adornment}>{endAdornment}</span>}
    </div>
  );
});
