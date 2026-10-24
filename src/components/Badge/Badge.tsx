import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './Badge.module.css';

export type BadgeIntent = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeVariant = 'subtle' | 'solid' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** @default 'neutral' */
  intent?: BadgeIntent;
  /** @default 'subtle' */
  variant?: BadgeVariant;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /** Element rendered before the label, usually an icon. */
  icon?: ReactNode;
}

/** Short status or category label. Not interactive: put it next to a control, not inside one. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { intent = 'neutral', variant = 'subtle', size = 'md', icon, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(styles.badge, styles[intent], styles[variant], styles[size], className)}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
});
