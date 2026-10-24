import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import choice from '@/styles/choice.module.css';
import type { ChoiceSize } from '../Checkbox';
import styles from './Switch.module.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label shown next to the switch. Without it, name the switch with `aria-label`. */
  children?: ReactNode;
  /** Extra text below the label, linked with `aria-describedby`. */
  description?: ReactNode;
  /** @default 'md' */
  size?: ChoiceSize;
  /** Called with the new on/off state. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * On/off toggle for a setting that applies right away. Uses `checked`/`defaultChecked` like a
 * checkbox and is announced as a switch.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    children,
    description,
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

  return (
    <div className={cn(choice.choice, choice[size], styles.switch, className)} style={style}>
      <span className={choice.control}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
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
        <span className={cn(choice.box, styles.track)} aria-hidden="true">
          <span className={styles.thumb} />
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
