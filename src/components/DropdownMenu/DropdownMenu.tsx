import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useControllableState } from '@/hooks/useControllableState';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useTimeout } from '@/hooks/useTimeout';
import { cn } from '@/utils/cn';
import { useFloatingLayer, type Placement } from '@/utils/floating';
import { getElementRef } from '@/utils/getElementRef';
import { mergeRefs } from '@/utils/mergeRefs';
import { refocusIfLost } from '@/utils/refocusIfLost';
import { Portal } from '../Portal';
import styles from './DropdownMenu.module.css';

interface MenuContextValue {
  close: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

type TriggerProps = {
  id?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
};

export type DropdownMenuPlacement = Placement;

export interface DropdownMenuProps {
  /** Button that opens the menu. It must accept a ref. */
  trigger: ReactElement<TriggerProps>;
  /** `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator` elements. */
  children: ReactNode;
  /** @default 'bottom-start' */
  placement?: DropdownMenuPlacement;
  /** Open state, for a controlled menu. */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Gap between the trigger and the menu, in pixels.
   * @default 4
   */
  offset?: number;
  /** Class of the menu panel. */
  className?: string;
}

const itemSelector = '[role="menuitem"]';

function getItems(menu: HTMLElement | null) {
  return menu ? [...menu.querySelectorAll<HTMLElement>(itemSelector)] : [];
}

function findByText(items: HTMLElement[], from: number, search: string) {
  const ordered = [...items.slice(from + 1), ...items.slice(0, from + 1)];
  const startsWith = (text: string) => (item: HTMLElement) =>
    item.textContent?.trim().toLowerCase().startsWith(text);
  const repeated = [...search].every((char) => char === search[0]);

  return (
    ordered.find(startsWith(search)) ??
    (repeated ? ordered.find(startsWith(search[0]!)) : undefined)
  );
}

/**
 * Menu of actions opened by a button, following the ARIA menu button pattern: arrow keys,
 * Home/End and typing a label move between items, Enter or Space runs one, Escape closes and
 * returns focus to the button.
 */
export function DropdownMenu({
  trigger,
  children,
  placement = 'bottom-start',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  offset = 4,
  className,
}: DropdownMenuProps) {
  const id = useId();
  const triggerId = trigger.props.id ?? `${id}-trigger`;
  const menuId = `${id}-menu`;
  const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
  const menu = useRef<HTMLDivElement>(null);
  const typeahead = useRef('');
  const clearTypeahead = useTimeout();
  const [focusOnOpen, setFocusOnOpen] = useState<'first' | 'last'>('first');
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const { setReference, setFloating, floatingStyles } = useFloatingLayer({
    open,
    placement,
    gap: offset,
  });
  const triggerElementRef = getElementRef<HTMLElement>(trigger);
  const attachTrigger = useMemo(
    () => mergeRefs<HTMLElement>(setReference, triggerElementRef, setTriggerNode),
    [setReference, triggerElementRef],
  );
  const attachMenu = useMemo(() => mergeRefs(setFloating, menu), [setFloating]);

  useEffect(() => {
    if (!open) return;
    const items = getItems(menu.current);
    (focusOnOpen === 'first' ? items[0] : items.at(-1))?.focus({ preventScroll: true });
  }, [open, focusOnOpen]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerNode?.focus();
  };

  useEscapeKey(() => close(), { enabled: open });
  useClickOutside(
    [menu, { current: triggerNode }],
    () => {
      close(false);
      refocusIfLost(triggerNode);
    },
    { enabled: open },
  );

  const openWith = (target: 'first' | 'last') => {
    setFocusOnOpen(target);
    setOpen(true);
  };

  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: attachTrigger,
        id: triggerId,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': open ? menuId : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          trigger.props.onClick?.(event);
          if (event.defaultPrevented) return;
          if (open) setOpen(false);
          else openWith('first');
        },
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          trigger.props.onKeyDown?.(event);
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            openWith(event.key === 'ArrowDown' ? 'first' : 'last');
          }
        },
      } as object)
    : trigger;

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getItems(menu.current);
    const index = items.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next: number) => items.at(next % items.length)?.focus();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusAt(index + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusAt(index <= 0 ? -1 : index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusAt(0);
        break;
      case 'End':
        event.preventDefault();
        focusAt(-1);
        break;
      case 'Tab':
        close();
        break;
      default:
        if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.key === ' ' && typeahead.current === '') return;
        event.preventDefault();
        typeahead.current += event.key.toLowerCase();
        clearTypeahead.set(() => {
          typeahead.current = '';
        }, 500);
        findByText(items, index, typeahead.current)?.focus();
    }
  };

  return (
    <>
      {triggerElement}
      {open && (
        <Portal>
          <div
            ref={attachMenu}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            aria-orientation="vertical"
            tabIndex={-1}
            className={cn(styles.menu, className)}
            style={floatingStyles}
            onKeyDown={onMenuKeyDown}
          >
            <MenuContext.Provider value={{ close }}>{children}</MenuContext.Provider>
          </div>
        </Portal>
      )}
    </>
  );
}

export interface DropdownMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Called when the item is chosen with a click, Enter or Space. */
  onSelect?: () => void;
  /** Icon shown before the label. */
  icon?: ReactNode;
  /** Keyboard shortcut shown after the label, for reference only. */
  shortcut?: string;
  /** Styles the item as a destructive action. @default false */
  destructive?: boolean;
  /**
   * Keeps the item focusable but prevents choosing it, as the menu pattern recommends.
   * @default false
   */
  disabled?: boolean;
  /**
   * Closes the menu after the item is chosen.
   * @default true
   */
  closeOnSelect?: boolean;
}

/** Action inside a `DropdownMenu`. */
export const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    {
      onSelect,
      icon,
      shortcut,
      destructive = false,
      disabled = false,
      closeOnSelect = true,
      className,
      children,
      onClick,
      onPointerMove,
      ...props
    },
    ref,
  ) {
    const menu = useContext(MenuContext);
    if (!menu) throw new Error('DropdownMenuItem must be rendered inside a DropdownMenu.');

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        tabIndex={-1}
        aria-disabled={disabled || undefined}
        className={cn(styles.item, destructive && styles.destructive, className)}
        onClick={(event) => {
          onClick?.(event);
          if (disabled || event.defaultPrevented) return;
          onSelect?.();
          if (closeOnSelect) menu.close();
        }}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (event.pointerType !== 'touch') event.currentTarget.focus();
        }}
        {...props}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.label}>{children}</span>
        {shortcut && (
          <kbd className={styles.shortcut} aria-hidden="true">
            {shortcut}
          </kbd>
        )}
      </button>
    );
  },
);

export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible heading of the group, which also names it. */
  label: ReactNode;
}

/** Labelled set of related items. */
export const DropdownMenuGroup = forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup({ label, className, children, ...props }, ref) {
    const labelId = useId();

    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={labelId}
        className={cn(styles.group, className)}
        {...props}
      >
        <div id={labelId} role="presentation" className={styles.groupLabel}>
          {label}
        </div>
        {children}
      </div>
    );
  },
);

/** Line between groups of items. */
export const DropdownMenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function DropdownMenuSeparator({ className, ...props }, ref) {
    return (
      <div ref={ref} role="separator" className={cn(styles.separator, className)} {...props} />
    );
  },
);
