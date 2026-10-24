import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type Key,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/cn';
import { mergeRefs } from '@/utils/mergeRefs';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from '../Icon';
import { Spinner } from '../Spinner';
import styles from './Table.module.css';

export type SortDirection = 'ascending' | 'descending';

export interface TableSort {
  /** `key` of the sorted column. */
  key: string;
  direction: SortDirection;
}

type SortValue = string | number | boolean | Date | null | undefined;

export interface TableColumn<Row> {
  /** Identifies the column. Also the property read from each row when there is no `cell`. */
  key: string;
  /** Content of the column header. */
  header: ReactNode;
  /** Renders the cell of a row. Defaults to `row[key]`. */
  cell?: (row: Row) => ReactNode;
  /**
   * Lets the user sort by this column.
   * @default false
   */
  sortable?: boolean;
  /** Value compared when sorting. Defaults to `row[key]`. */
  sortValue?: (row: Row) => SortValue;
  /** @default 'start' */
  align?: 'start' | 'center' | 'end';
  /** CSS width of the column. */
  width?: string;
  /**
   * Renders the cells as row headers (`<th scope="row">`), so screen readers announce them
   * with every cell of the row. Use it for the column that names each row.
   * @default false
   */
  rowHeader?: boolean;
}

export interface TableProps<Row> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  columns: TableColumn<Row>[];
  data: Row[];
  /** Returns a stable key for each row. */
  getRowKey: (row: Row, index: number) => Key;
  /** Title of the table. It names the table and its scroll region, so prefer setting it. */
  caption?: ReactNode;
  /**
   * Keeps the caption for assistive technology only.
   * @default false
   */
  hideCaption?: boolean;
  /** Sorted column, for controlled sorting. `null` means unsorted. */
  sort?: TableSort | null;
  /** @default null */
  defaultSort?: TableSort | null;
  /** Called when the user sorts by a column. */
  onSortChange?: (sort: TableSort | null) => void;
  /**
   * Leaves `data` in the order given, for sorting on the server.
   * @default false
   */
  manualSorting?: boolean;
  /**
   * Shown in place of the rows when `data` is empty.
   * @default 'No data to show.'
   */
  emptyState?: ReactNode;
  /**
   * Marks the table as busy and shows a spinner while there are no rows yet.
   * @default false
   */
  loading?: boolean;
  /** @default 'normal' */
  density?: 'compact' | 'normal';
  /** @default false */
  striped?: boolean;
  /**
   * Keeps the header visible while the rows scroll. Give the table a `max-height` to scroll it.
   * @default false
   */
  stickyHeader?: boolean;
}

const read = (row: unknown, key: string) => (row as Record<string, unknown>)[key];

function compare(a: SortValue, b: SortValue) {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

function TableInner<Row>(
  {
    columns,
    data,
    getRowKey,
    caption,
    hideCaption = false,
    sort,
    defaultSort = null,
    onSortChange,
    manualSorting = false,
    emptyState = 'No data to show.',
    loading = false,
    density = 'normal',
    striped = false,
    stickyHeader = false,
    className,
    ...props
  }: TableProps<Row>,
  ref: Ref<HTMLDivElement>,
) {
  const captionId = useId();
  const region = useRef<HTMLDivElement>(null);
  const attachRegion = useMemo(() => mergeRefs(region, ref), [ref]);
  const [overflowing, setOverflowing] = useState(false);
  const [currentSort, setSort] = useControllableState<TableSort | null>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });

  useEffect(() => {
    const node = region.current;
    if (!node) return;

    const observer = new ResizeObserver(() => {
      setOverflowing(node.scrollWidth > node.clientWidth || node.scrollHeight > node.clientHeight);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const rows = useMemo(() => {
    const column = columns.find((item) => item.key === currentSort?.key);
    if (manualSorting || !currentSort || !column) return data;

    const valueOf = column.sortValue ?? ((row: Row) => read(row, column.key) as SortValue);
    const sign = currentSort.direction === 'ascending' ? 1 : -1;
    return [...data].sort((a, b) => compare(valueOf(a), valueOf(b)) * sign);
  }, [columns, currentSort, data, manualSorting]);

  const toggleSort = (key: string) => {
    const direction =
      currentSort?.key === key && currentSort.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setSort({ key, direction });
  };

  const hasCaption = caption !== undefined && caption !== null;
  const scrollTabIndex = overflowing ? 0 : undefined;
  const named =
    hasCaption || props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined;

  return (
    <div
      ref={attachRegion}
      role={named ? 'region' : undefined}
      aria-labelledby={hasCaption ? captionId : undefined}
      tabIndex={scrollTabIndex}
      className={cn(styles.wrapper, className)}
      {...props}
    >
      <table
        aria-busy={loading || undefined}
        className={cn(
          styles.table,
          styles[density],
          striped && styles.striped,
          stickyHeader && styles.sticky,
        )}
      >
        {hasCaption && (
          <caption id={captionId} className={cn(styles.caption, hideCaption && styles.hidden)}>
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {columns.map((column) => {
              const sorted = currentSort?.key === column.key ? currentSort.direction : undefined;
              const SortIcon =
                sorted === 'ascending'
                  ? ArrowUpIcon
                  : sorted === 'descending'
                    ? ArrowDownIcon
                    : ArrowUpDownIcon;

              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={sorted}
                  className={cn(styles.headerCell, column.align && styles[column.align])}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => toggleSort(column.key)}
                    >
                      {column.header}
                      <SortIcon className={cn(styles.sortIcon, sorted && styles.sortIconActive)} />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {loading ? <Spinner label="Loading rows" /> : emptyState}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={getRowKey(row, index)} className={styles.row}>
                {columns.map((column) => {
                  const content = column.cell
                    ? column.cell(row)
                    : (read(row, column.key) as ReactNode);
                  const className = cn(styles.cell, column.align && styles[column.align]);

                  return column.rowHeader ? (
                    <th key={column.key} scope="row" className={cn(className, styles.rowHeader)}>
                      {content}
                    </th>
                  ) : (
                    <td key={column.key} className={className}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Data table with sortable columns, an empty state and a scroll region for narrow screens. The
 * region becomes focusable when it overflows, so keyboard users can scroll it.
 */
export const Table = forwardRef(TableInner) as <Row>(
  props: TableProps<Row> & { ref?: Ref<HTMLDivElement> },
) => ReactElement;
