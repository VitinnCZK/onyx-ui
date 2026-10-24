import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Short statement of what is missing, such as "No projects yet". */
  title: ReactNode;
  /** What the user can do about it. */
  description?: ReactNode;
  /** Illustration or icon shown above the title. It is decorative. */
  icon?: ReactNode;
  /** Primary way forward, usually a `Button`. */
  action?: ReactNode;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /**
   * Level of the title heading. Match it to the outline of the page.
   * @default 3
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

/** Placeholder for a list, table or page that has no content yet or no results. */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, action, size = 'md', headingLevel = 3, className, ...props },
  ref,
) {
  const Title = `h${headingLevel}` as const;

  return (
    <div ref={ref} className={cn(styles.emptyState, styles[size], className)} {...props}>
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}
      <Title className={styles.title}>{title}</Title>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
});
