import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { ErrorIcon } from '../Icon';
import { Label } from '../Label';
import { VisuallyHidden } from '../VisuallyHidden';
import { FormFieldContext } from './formFieldContext';
import styles from './FormField.module.css';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible caption, rendered as the `<label>` of the control. */
  label: ReactNode;
  /** Hint shown below the control and linked with `aria-describedby`. */
  helperText?: ReactNode;
  /** Error message. Marks the control as invalid and is linked with `aria-describedby`. */
  error?: ReactNode;
  /** Marks the control as required and shows a marker next to the label. */
  required?: boolean;
  /** Disables the control. */
  disabled?: boolean;
  /** Keeps the label for assistive technology only. */
  hideLabel?: boolean;
  /** Id of the control. Generated when omitted. */
  controlId?: string;
  /** One `Input`, `Textarea`, `Select` or `Slider`, which picks up the field's id and state. */
  children: ReactNode;
}

/**
 * Wraps a form control with its label, helper text and error message, and wires them up with
 * `htmlFor`, `aria-describedby` and `aria-invalid`.
 */
export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(function FormField(
  {
    label,
    helperText,
    error,
    required,
    disabled,
    hideLabel = false,
    controlId,
    className,
    children,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = controlId ?? generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const hasHelper = helperText !== undefined && helperText !== null;
  const invalid = error !== undefined && error !== null && error !== false;

  const labelElement = (
    <Label htmlFor={id} required={required} disabled={disabled}>
      {label}
    </Label>
  );

  return (
    <div ref={ref} className={cn(styles.field, className)} {...props}>
      {hideLabel ? <VisuallyHidden>{labelElement}</VisuallyHidden> : labelElement}
      <FormFieldContext.Provider
        value={{
          id,
          describedBy: cn(hasHelper && helperId, invalid && errorId) || undefined,
          invalid,
          disabled,
          required,
        }}
      >
        {children}
      </FormFieldContext.Provider>
      {hasHelper && (
        <p id={helperId} className={styles.helper}>
          {helperText}
        </p>
      )}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <ErrorIcon className={styles.errorIcon} />
          {error}
        </p>
      )}
    </div>
  );
});
