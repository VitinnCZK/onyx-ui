import { forwardRef, type HTMLAttributes } from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/cn';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icon';
import styles from './Pagination.module.css';

export type PaginationItem = number | 'ellipsis';

/**
 * Pages to show: the first and last `boundaryCount` pages, `siblingCount` pages around the
 * current one and `'ellipsis'` for the gaps. The number of items stays the same while the
 * current page changes, so the buttons do not jump around.
 */
export function getPaginationItems(
  page: number,
  count: number,
  siblingCount = 1,
  boundaryCount = 1,
): PaginationItem[] {
  const range = (start: number, end: number) =>
    Array.from({ length: Math.max(end - start + 1, 0) }, (_, index) => start + index);

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);
  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    (endPages[0] ?? count + 1) - 2,
  );

  return [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (['ellipsis'] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? (['ellipsis'] as const)
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
  ];
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Number of pages. */
  totalPages: number;
  /** Current page, starting at 1, for a controlled pagination. */
  page?: number;
  /** @default 1 */
  defaultPage?: number;
  /** Called with the page the user chose. */
  onPageChange?: (page: number) => void;
  /**
   * Pages shown on each side of the current page.
   * @default 1
   */
  siblingCount?: number;
  /**
   * Pages always shown at the start and the end.
   * @default 1
   */
  boundaryCount?: number;
  /** @default 'md' */
  size?: 'sm' | 'md';
  /**
   * Accessible name of the navigation landmark.
   * @default 'Pagination'
   */
  'aria-label'?: string;
  /** @default 'Previous page' */
  previousLabel?: string;
  /** @default 'Next page' */
  nextLabel?: string;
  /**
   * Accessible name of each page button.
   * @default (page) => `Page ${page}`
   */
  getPageLabel?: (page: number) => string;
}

/** Moves between the pages of a long list. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    totalPages,
    page,
    defaultPage = 1,
    onPageChange,
    siblingCount = 1,
    boundaryCount = 1,
    size = 'md',
    'aria-label': ariaLabel = 'Pagination',
    previousLabel = 'Previous page',
    nextLabel = 'Next page',
    getPageLabel = (value) => `Page ${value}`,
    className,
    ...props
  },
  ref,
) {
  const [current, setCurrent] = useControllableState({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const total = Math.max(totalPages, 1);
  const active = Math.min(Math.max(current, 1), total);

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn(styles.pagination, styles[size], className)}
      {...props}
    >
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            aria-label={previousLabel}
            className={cn(styles.button, styles.step)}
            aria-disabled={active <= 1 || undefined}
            onClick={() => {
              if (active > 1) setCurrent(active - 1);
            }}
          >
            <ChevronLeftIcon className={styles.icon} />
          </button>
        </li>
        {getPaginationItems(active, total, siblingCount, boundaryCount).map((item, index) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                aria-label={getPageLabel(item)}
                aria-current={item === active ? 'page' : undefined}
                className={styles.button}
                onClick={() => setCurrent(item)}
              >
                {item}
              </button>
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            aria-label={nextLabel}
            className={cn(styles.button, styles.step)}
            aria-disabled={active >= total || undefined}
            onClick={() => {
              if (active < total) setCurrent(active + 1);
            }}
          >
            <ChevronRightIcon className={styles.icon} />
          </button>
        </li>
      </ul>
    </nav>
  );
});
