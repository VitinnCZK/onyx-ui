import { forwardRef, type CSSProperties, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import field from '@/styles/field.module.css';
import { useFieldControl } from '../FormField/formFieldContext';
import type { FieldSize } from '../Input';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** @default 'md' */
  size?: FieldSize;
  /** Marks the value as invalid. Inside a `FormField`, defaults to whether it has an error. */
  invalid?: boolean;
  /** @default 'vertical' */
  resize?: 'none' | 'vertical' | 'both';
  /**
   * Grows with its content, starting from `rows`, in browsers that support `field-sizing`.
   * @default false
   */
  autoResize?: boolean;
}

/** Multi-line text field. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    size = 'md',
    invalid,
    resize = 'vertical',
    autoResize = false,
    rows = 3,
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

  return (
    <textarea
      ref={ref}
      rows={rows}
      id={control.id}
      disabled={control.disabled}
      required={control.required}
      aria-invalid={control['aria-invalid']}
      aria-describedby={control['aria-describedby']}
      data-invalid={control.invalid || undefined}
      className={cn(
        field.control,
        field[size],
        styles.textarea,
        styles[resize],
        autoResize && styles.autoResize,
        className,
      )}
      style={autoResize ? ({ '--textarea-rows': rows, ...style } as CSSProperties) : style}
      {...props}
    />
  );
});
