import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/cn';
import styles from './Tabs.module.css';

interface TabsContextValue {
  value: string | undefined;
  select: (value: string) => void;
  baseId: string;
  activationMode: 'automatic' | 'manual';
  orientation: 'horizontal' | 'vertical';
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`${component} must be rendered inside Tabs.`);
  return context;
}

const toId = (value: string) => value.replace(/\s+/g, '-');

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** Value of the selected tab, for controlled tabs. */
  value?: string;
  /** Value of the tab selected at first, for uncontrolled tabs. */
  defaultValue?: string;
  /** Called with the value of the tab that becomes selected. */
  onValueChange?: (value: string) => void;
  /**
   * `automatic` selects a tab as soon as it receives focus; `manual` waits for Enter or Space,
   * which suits panels that are slow to render.
   * @default 'automatic'
   */
  activationMode?: 'automatic' | 'manual';
  /**
   * Also sets which arrow keys move between tabs.
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /** @default 'line' */
  variant?: 'line' | 'solid';
  /** @default 'md' */
  size?: 'sm' | 'md';
}

/** Switches between panels of content, one visible at a time. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    value,
    defaultValue,
    onValueChange,
    activationMode = 'automatic',
    orientation = 'horizontal',
    variant = 'line',
    size = 'md',
    className,
    children,
    ...props
  },
  ref,
) {
  const baseId = useId();
  const [selected, setSelected] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: (next) => {
      if (next !== undefined) onValueChange?.(next);
    },
  });

  return (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(styles.tabs, styles[orientation], styles[variant], styles[size], className)}
      {...props}
    >
      <TabsContext.Provider
        value={{ value: selected, select: setSelected, baseId, activationMode, orientation }}
      >
        {children}
      </TabsContext.Provider>
    </div>
  );
});

export type TabListProps = HTMLAttributes<HTMLDivElement>;

/** Row of `Tab` buttons. Name it with `aria-label` or `aria-labelledby`. */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabList(
  { className, ...props },
  ref,
) {
  const { orientation } = useTabsContext('TabList');

  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation={orientation}
      className={cn(styles.list, className)}
      {...props}
    />
  );
});

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /** Identifies the tab and the `TabPanel` it shows. */
  value: string;
}

/** Button that shows the `TabPanel` with the same `value`. */
export const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab(
  { value, className, onClick, onKeyDown, ...props },
  ref,
) {
  const {
    value: selectedValue,
    select,
    baseId,
    orientation,
    activationMode,
  } = useTabsContext('Tab');
  const selected = selectedValue === value;

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    const list = event.currentTarget.closest('[role="tablist"]');
    if (event.defaultPrevented || !list) return;

    const tabs = [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')];
    const index = tabs.indexOf(event.currentTarget);
    const rtl = getComputedStyle(list).direction === 'rtl';
    const [previous, next] =
      orientation === 'vertical'
        ? ['ArrowUp', 'ArrowDown']
        : rtl
          ? ['ArrowRight', 'ArrowLeft']
          : ['ArrowLeft', 'ArrowRight'];

    let target: HTMLButtonElement | undefined;
    if (event.key === next) target = tabs[(index + 1) % tabs.length];
    else if (event.key === previous) target = tabs.at(index - 1);
    else if (event.key === 'Home') target = tabs[0];
    else if (event.key === 'End') target = tabs.at(-1);
    if (!target) return;

    event.preventDefault();
    target.focus();
    if (activationMode === 'automatic' && target.dataset.value) select(target.dataset.value);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`${baseId}-tab-${toId(value)}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${toId(value)}`}
      tabIndex={selected || selectedValue === undefined ? 0 : -1}
      data-value={value}
      className={cn(styles.tab, className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) select(value);
      }}
      onKeyDown={onTabKeyDown}
      {...props}
    />
  );
});

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Value of the `Tab` that shows this panel. */
  value: string;
}

/** Content shown while the `Tab` with the same `value` is selected. */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { value, tabIndex = 0, className, ...props },
  ref,
) {
  const { value: selectedValue, baseId } = useTabsContext('TabPanel');

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`${baseId}-panel-${toId(value)}`}
      aria-labelledby={`${baseId}-tab-${toId(value)}`}
      tabIndex={tabIndex}
      hidden={selectedValue !== value}
      className={cn(styles.panel, className)}
      {...props}
    />
  );
});
