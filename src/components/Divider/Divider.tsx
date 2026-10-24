import { forwardRef, type HTMLAttributes, type Ref } from 'react';
import { cn } from '@/utils/cn';
import styles from './Divider.module.css';

export interface DividerProps extends HTMLAttributes<HTMLElement> {
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Space around the line, along its cross axis.
   * @default 'md'
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /**
   * Hides the line from assistive technology when it only decorates and does not separate
   * sections of content.
   * @default false
   */
  decorative?: boolean;
}

/** Line that separates content, announced as a separator unless decorative. */
export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(
  { orientation = 'horizontal', spacing = 'md', decorative = false, className, ...props },
  ref,
) {
  const classes = cn(styles.divider, styles[orientation], styles[spacing], className);

  if (orientation === 'horizontal') {
    return (
      <hr
        ref={ref as Ref<HTMLHRElement>}
        role={decorative ? 'none' : undefined}
        className={classes}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref as Ref<HTMLDivElement>}
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : 'vertical'}
      className={classes}
      {...props}
    />
  );
});
