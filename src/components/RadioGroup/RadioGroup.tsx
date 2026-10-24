import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/cn';
import choice from '@/styles/choice.module.css';
import type { ChoiceSize } from '../Checkbox';
import { ErrorIcon } from '../Icon';
import styles from './RadioGroup.module.css';

interface RadioGroupContextValue {
  name: string;
  value: string | null;
  setValue: (value: string) => void;
  size: ChoiceSize;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  /** Visible caption of the group. */
  label: ReactNode;
  /** Extra text below the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /** Error message. Marks the group as invalid and is linked with `aria-describedby`. */
  error?: ReactNode;
  /** Name shared by the radios, used when the form is submitted. Generated when omitted. */
  name?: string;
  /** Selected value, for a controlled group. `null` selects nothing. */
  value?: string | null;
  /** Initially selected value, for an uncontrolled group. */
  defaultValue?: string | null;
  /** Called with the value of the radio that was selected. */
  onValueChange?: (value: string) => void;
  /** @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** @default 'md' */
  size?: ChoiceSize;
  /** @default false */
  disabled?: boolean;
  /** @default false */
  required?: boolean;
}

/**
 * Set of radios where only one can be selected. Arrow keys move the selection and Tab moves
 * past the group, as native radios do.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    label,
    description,
    error,
    name,
    value,
    defaultValue = null,
    onValueChange,
    orientation = 'vertical',
    size = 'md',
    disabled = false,
    required = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const id = useId();
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const invalid = error !== undefined && error !== null && error !== false;
  const [selected, setSelected] = useControllableState<string | null>({
    value,
    defaultValue,
    onChange: (next) => {
      if (next !== null) onValueChange?.(next);
    },
  });

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-labelledby={labelId}
      aria-describedby={cn(Boolean(description) && descriptionId, invalid && errorId) || undefined}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      aria-disabled={disabled || undefined}
      className={cn(styles.group, className)}
      {...props}
    >
      <span id={labelId} className={styles.label} data-disabled={disabled || undefined}>
        {label}
        {required && (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        )}
      </span>
      {description && (
        <span id={descriptionId} className={styles.description}>
          {description}
        </span>
      )}
      <div className={cn(styles.options, styles[orientation])}>
        <RadioGroupContext.Provider
          value={{
            name: name ?? id,
            value: selected,
            setValue: setSelected,
            size,
            disabled,
            required,
            invalid,
          }}
        >
          {children}
        </RadioGroupContext.Provider>
      </div>
      {invalid && (
        <span id={errorId} className={styles.error}>
          <ErrorIcon className={styles.errorIcon} />
          {error}
        </span>
      )}
    </div>
  );
});

export interface RadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size' | 'name' | 'value' | 'checked' | 'defaultChecked'
> {
  /** Value selected in the group when this radio is chosen. */
  value: string;
  /** Label shown next to the radio. */
  children?: ReactNode;
  /** Extra text below the label, linked with `aria-describedby`. */
  description?: ReactNode;
}

/** One option of a `RadioGroup`. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    value,
    children,
    description,
    disabled,
    className,
    style,
    id,
    onChange,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error('Radio must be rendered inside a RadioGroup.');

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className={cn(choice.choice, choice[group.size], className)} style={style}>
      <span className={choice.control}>
        <input
          ref={ref}
          type="radio"
          id={inputId}
          name={group.name}
          value={value}
          checked={group.value === value}
          disabled={group.disabled || disabled}
          required={group.required}
          aria-describedby={
            cn(description !== undefined && descriptionId, describedBy) || undefined
          }
          className={choice.input}
          onChange={(event) => {
            onChange?.(event);
            if (event.target.checked) group.setValue(value);
          }}
          {...props}
        />
        <span
          className={cn(choice.box, styles.box)}
          data-invalid={group.invalid || undefined}
          aria-hidden="true"
        />
      </span>
      {children !== undefined && (
        <label htmlFor={inputId} className={choice.label}>
          {children}
        </label>
      )}
      {description !== undefined && (
        <span id={descriptionId} className={choice.description}>
          {description}
        </span>
      )}
    </div>
  );
});
