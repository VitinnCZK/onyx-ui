import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { mergeRefs } from '@/utils/mergeRefs';
import choice from '@/styles/choice.module.css';
import { CheckIcon, MinusIcon } from '../Icon';
import styles from './Checkbox.module.css';

export type ChoiceSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Label shown next to the box. Without it, name the checkbox with `aria-label`. */
  children?: ReactNode;
  /** Extra text below the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /**
   * Shows a dash for a "some selected" state. It is visual and announced as mixed, but clicking
   * still toggles `checked`.
   * @default false
   */
  indeterminate?: boolean;
  /** Marks the checkbox as invalid. */
  invalid?: boolean;
  /** @default 'md' */
  size?: ChoiceSize;
  /** Called with the new checked state. */
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    children,
    description,
    indeterminate = false,
    invalid = false,
    size = 'md',
    onCheckedChange,
    onChange,
    className,
    style,
    id,
    'aria-describedby': describedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMemo(() => mergeRefs(ref, inputRef), [ref]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  });

  return (
    <div className={cn(choice.choice, choice[size], className)} style={style}>
      <span className={choice.control}>
        <input
          ref={mergedRef}
          type="checkbox"
          id={inputId}
          aria-invalid={invalid || undefined}
          aria-describedby={
            cn(description !== undefined && descriptionId, describedBy) || undefined
          }
          className={choice.input}
          onChange={(event) => {
            onChange?.(event);
            onCheckedChange?.(event.target.checked);
          }}
          {...props}
        />
        <span className={cn(choice.box, styles.box)} aria-hidden="true">
          <CheckIcon className={styles.check} />
          <MinusIcon className={styles.dash} />
        </span>
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
