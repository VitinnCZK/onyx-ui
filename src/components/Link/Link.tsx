import { forwardRef, type ElementType } from 'react';
import { cn } from '@/utils/cn';
import type {
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicPropsWithRef,
} from '@/utils/polymorphic';
import { ExternalLinkIcon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'muted' | 'inherit';

export interface LinkOwnProps {
  /**
   * `inherit` takes the color of the surrounding text and relies on the underline.
   * @default 'default'
   */
  variant?: LinkVariant;
  /**
   * Opens the link in a new tab, adds a safe `rel` and tells every user about it.
   * @default false
   */
  external?: boolean;
  /**
   * Text announced after the link text when `external`.
   * @default '(opens in a new tab)'
   */
  externalLabel?: string;
}

export type LinkProps<As extends ElementType = 'a'> = PolymorphicPropsWithRef<As, LinkOwnProps>;

/** Text link. Use `as` to render a router link while keeping the styles. */
export const Link = forwardRef<HTMLAnchorElement, PolymorphicProps<'a', LinkOwnProps>>(
  function Link(
    {
      as: Component = 'a',
      variant = 'default',
      external = false,
      externalLabel = '(opens in a new tab)',
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Component
        ref={ref}
        className={cn(styles.link, styles[variant], className)}
        {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
        {...props}
      >
        {children}
        {external && (
          <>
            {' '}
            <ExternalLinkIcon className={styles.externalIcon} />
            <VisuallyHidden>{externalLabel}</VisuallyHidden>
          </>
        )}
      </Component>
    );
  },
) as PolymorphicComponent<'a', LinkOwnProps>;
