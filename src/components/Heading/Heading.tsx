import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /**
   * Rank in the document outline, rendered as `<h1>` to `<h6>`. Pick it from the structure of
   * the page, then use `size` for the look.
   * @default 2
   */
  level?: HeadingLevel;
  /** Visual size. Defaults to a size that matches `level`. */
  size?: HeadingSize;
}

const defaultSizes: Record<HeadingLevel, HeadingSize> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
};

const sizeClasses: Record<HeadingSize, string | undefined> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
  '2xl': styles.size2xl,
  '3xl': styles.size3xl,
  '4xl': styles.size4xl,
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size = defaultSizes[level], className, ...props },
  ref,
) {
  const Component = `h${level}` as const;

  return (
    <Component ref={ref} className={cn(styles.heading, sizeClasses[size], className)} {...props} />
  );
});
