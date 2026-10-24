import {
  createContext,
  forwardRef,
  useContext,
  type ElementType,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import type {
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicPropsWithRef,
} from '@/utils/polymorphic';
import { ChevronRightIcon } from '../Icon';
import styles from './Breadcrumb.module.css';

const SeparatorContext = createContext<ReactNode>(null);

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  /** Element shown between items. Defaults to a chevron. */
  separator?: ReactNode;
  /**
   * Accessible name of the navigation landmark.
   * @default 'Breadcrumb'
   */
  'aria-label'?: string;
}

/** Trail of links from the home page to the current page. */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  {
    separator = <ChevronRightIcon />,
    'aria-label': ariaLabel = 'Breadcrumb',
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <nav ref={ref} aria-label={ariaLabel} className={cn(styles.breadcrumb, className)} {...props}>
      <ol className={styles.list}>
        <SeparatorContext.Provider value={separator}>{children}</SeparatorContext.Provider>
      </ol>
    </nav>
  );
});

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;

/** One step of the trail. Holds a `BreadcrumbLink`. */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ className, children, ...props }, ref) {
    const separator = useContext(SeparatorContext);

    return (
      <li ref={ref} className={cn(styles.item, className)} {...props}>
        <span className={styles.separator} aria-hidden="true">
          {separator}
        </span>
        {children}
      </li>
    );
  },
);

export interface BreadcrumbLinkOwnProps {
  /**
   * Marks the link as the current page with `aria-current="page"`.
   * @default false
   */
  current?: boolean;
}

export type BreadcrumbLinkProps<As extends ElementType = 'a'> = PolymorphicPropsWithRef<
  As,
  BreadcrumbLinkOwnProps
>;

/** Link of a `BreadcrumbItem`. Use `as` to render a router link. */
export const BreadcrumbLink = forwardRef<
  HTMLAnchorElement,
  PolymorphicProps<'a', BreadcrumbLinkOwnProps>
>(function BreadcrumbLink({ as: Component = 'a', current = false, className, ...props }, ref) {
  return (
    <Component
      ref={ref}
      aria-current={current ? 'page' : undefined}
      className={cn(styles.link, className)}
      {...props}
    />
  );
}) as PolymorphicComponent<'a', BreadcrumbLinkOwnProps>;
