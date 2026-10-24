import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import type {
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicPropsWithRef,
} from '@/utils/polymorphic';
import styles from './Card.module.css';

export interface CardOwnProps {
  /** @default 'outline' */
  variant?: 'outline' | 'elevated' | 'filled';
  /**
   * Inner spacing, shared by the header, body and footer.
   * @default 'md'
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export type CardProps<As extends ElementType = 'div'> = PolymorphicPropsWithRef<As, CardOwnProps>;

/**
 * Surface that groups related content. Use `as="article"` or `as="section"` when the content
 * stands on its own, and `CardHeader`, `CardBody` and `CardFooter` to lay it out.
 */
export const Card = forwardRef<HTMLDivElement, PolymorphicProps<'div', CardOwnProps>>(function Card(
  { as: Component = 'div', variant = 'outline', padding = 'md', className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      className={cn(styles.card, styles[variant], styles[padding], className)}
      {...props}
    />
  );
}) as PolymorphicComponent<'div', CardOwnProps>;

export type CardSectionProps = HTMLAttributes<HTMLDivElement>;

/** Top of a card, usually a heading with an optional action beside it. */
export const CardHeader = forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(styles.header, className)} {...props} />;
});

/** Main content of a card. */
export const CardBody = forwardRef<HTMLDivElement, CardSectionProps>(function CardBody(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(styles.body, className)} {...props} />;
});

/** Bottom of a card, usually actions. */
export const CardFooter = forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(styles.footer, className)} {...props} />;
});
