import { forwardRef, type ElementType } from 'react';
import { cn } from '@/utils/cn';
import type {
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicPropsWithRef,
} from '@/utils/polymorphic';
import styles from './VisuallyHidden.module.css';

export type VisuallyHiddenProps<As extends ElementType = 'span'> = PolymorphicPropsWithRef<As>;

export const VisuallyHidden = forwardRef<HTMLSpanElement, PolymorphicProps<'span'>>(
  function VisuallyHidden({ as: Component = 'span', className, ...props }, ref) {
    return <Component ref={ref} className={cn(styles.visuallyHidden, className)} {...props} />;
  },
) as PolymorphicComponent<'span'>;
