import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type Context,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '../Icon';
import styles from './Accordion.module.css';

type HeadingLevel = 2 | 3 | 4 | 5 | 6;

interface AccordionContextValue {
  expanded: string[];
  toggle: (value: string) => void;
  canCollapse: (value: string) => boolean;
  headingLevel: HeadingLevel;
}

interface ItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);

function useRequiredContext<T>(context: Context<T | null>, message: string): T {
  const value = useContext(context);
  if (!value) throw new Error(message);
  return value;
}

export interface AccordionProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  /**
   * `single` keeps at most one section open; `multiple` lets any number stay open.
   * @default 'single'
   */
  type?: 'single' | 'multiple';
  /** Values of the open sections, for a controlled accordion. */
  value?: string[];
  /** Values of the sections open at first, for an uncontrolled accordion. */
  defaultValue?: string[];
  /** Called with the values of the open sections. */
  onValueChange?: (value: string[]) => void;
  /**
   * In `single` mode, lets the open section close so that none is open.
   * @default true
   */
  collapsible?: boolean;
  /**
   * Level of the heading that wraps each trigger. Match it to the outline of the page.
   * @default 3
   */
  headingLevel?: HeadingLevel;
}

/** Stack of sections whose content expands and collapses. */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    type = 'single',
    value,
    defaultValue = [],
    onValueChange,
    collapsible = true,
    headingLevel = 3,
    className,
    children,
    ...props
  },
  ref,
) {
  const [expanded, setExpanded] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const canCollapse = (item: string) =>
    type === 'multiple' || collapsible || !expanded.includes(item);

  const toggle = (item: string) => {
    if (expanded.includes(item)) {
      if (canCollapse(item)) setExpanded(expanded.filter((open) => open !== item));
    } else {
      setExpanded(type === 'single' ? [item] : [...expanded, item]);
    }
  };

  return (
    <div ref={ref} data-accordion="" className={cn(styles.accordion, className)} {...props}>
      <AccordionContext.Provider value={{ expanded, toggle, canCollapse, headingLevel }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
});

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Identifies the section in `value`. */
  value: string;
  /** @default false */
  disabled?: boolean;
}

/** One section: an `AccordionTrigger` followed by its `AccordionContent`. */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled = false, className, children, ...props },
  ref,
) {
  const { expanded } = useRequiredContext(
    AccordionContext,
    'AccordionItem must be rendered inside an Accordion.',
  );
  const id = useId();
  const open = expanded.includes(value);

  return (
    <div
      ref={ref}
      data-state={open ? 'open' : 'closed'}
      className={cn(styles.item, className)}
      {...props}
    >
      <ItemContext.Provider
        value={{
          value,
          open,
          disabled,
          triggerId: `${id}-trigger`,
          contentId: `${id}-content`,
        }}
      >
        {children}
      </ItemContext.Provider>
    </div>
  );
});

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

/** Heading button that expands and collapses its section. */
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, children, onClick, onKeyDown, ...props }, ref) {
    const accordion = useRequiredContext(
      AccordionContext,
      'AccordionTrigger must be rendered inside an Accordion.',
    );
    const item = useRequiredContext(
      ItemContext,
      'AccordionTrigger must be rendered inside an AccordionItem.',
    );
    const Heading = `h${accordion.headingLevel}` as const;
    const locked = item.open && !accordion.canCollapse(item.value);

    const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      const root = event.currentTarget.closest('[data-accordion]');
      if (event.defaultPrevented || !root) return;

      const triggers = [
        ...root.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]:not(:disabled)'),
      ].filter((trigger) => trigger.closest('[data-accordion]') === root);
      const index = triggers.indexOf(event.currentTarget);

      let target: HTMLButtonElement | undefined;
      if (event.key === 'ArrowDown') target = triggers[(index + 1) % triggers.length];
      else if (event.key === 'ArrowUp') target = triggers.at(index - 1);
      else if (event.key === 'Home') target = triggers[0];
      else if (event.key === 'End') target = triggers.at(-1);
      if (!target) return;

      event.preventDefault();
      target.focus();
    };

    return (
      <Heading className={styles.heading}>
        <button
          ref={ref}
          type="button"
          id={item.triggerId}
          aria-expanded={item.open}
          aria-controls={item.contentId}
          aria-disabled={locked || undefined}
          disabled={item.disabled}
          data-accordion-trigger=""
          className={cn(styles.trigger, className)}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) accordion.toggle(item.value);
          }}
          onKeyDown={onTriggerKeyDown}
          {...props}
        >
          <span className={styles.label}>{children}</span>
          <ChevronDownIcon className={styles.chevron} />
        </button>
      </Heading>
    );
  },
);

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

/** Content of a section, hidden while it is collapsed. */
export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...props }, ref) {
    const item = useRequiredContext(
      ItemContext,
      'AccordionContent must be rendered inside an AccordionItem.',
    );

    return (
      <div
        ref={ref}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        hidden={!item.open}
        className={cn(styles.content, className)}
        {...props}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    );
  },
);
