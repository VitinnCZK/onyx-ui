import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';
import { Button } from '../Button';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '../Icon';
import { IconButton } from '../IconButton';
import { Portal } from '../Portal';
import styles from './Toast.module.css';

export type ToastIntent = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type ToastPlacement =
  'top-start' | 'top-center' | 'top-end' | 'bottom-start' | 'bottom-center' | 'bottom-end';

export interface ToastOptions {
  /** Reuse an id to replace a toast that is still open. Generated when omitted. */
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  /** @default 'neutral' */
  intent?: ToastIntent;
  /**
   * Milliseconds before it closes on its own. `null` keeps it open until dismissed. Defaults to
   * the provider's `duration`.
   */
  duration?: number | null;
  /** Button shown in the toast. Dismisses the toast after `onClick` runs. */
  action?: { label: string; onClick: () => void };
  /** Called when the toast closes, for any reason. */
  onDismiss?: () => void;
}

interface ToastData extends ToastOptions {
  id: string;
}

export interface ToastContextValue {
  /** Shows a toast, or queues it while `max` toasts are visible. Returns its id. */
  toast: (options: ToastOptions) => string;
  /** Closes the toast with this id, or every toast when called without one. */
  dismiss: (id?: string) => void;
}

const placementClasses: Record<ToastPlacement, string | undefined> = {
  'top-start': styles.topStart,
  'top-center': styles.topCenter,
  'top-end': styles.topEnd,
  'bottom-start': styles.bottomStart,
  'bottom-center': styles.bottomCenter,
  'bottom-end': styles.bottomEnd,
};

const ToastContext = createContext<ToastContextValue | null>(null);

/** Shows and dismisses toasts. Must be called inside a `ToastProvider`. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside a ToastProvider.');
  return context;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /**
   * Default time, in milliseconds, before a toast closes on its own.
   * @default 5000
   */
  duration?: number;
  /**
   * Toasts visible at once. The rest wait in a queue and appear as others close.
   * @default 3
   */
  max?: number;
  /** @default 'bottom-end' */
  placement?: ToastPlacement;
  /**
   * Accessible name of the notification region.
   * @default 'Notifications'
   */
  label?: string;
  /**
   * Key that moves focus to the newest toast, so keyboard users can reach its buttons.
   * @default 'F8'
   */
  hotkey?: string;
  /**
   * Accessible name of the dismiss button of each toast.
   * @default 'Dismiss notification'
   */
  dismissLabel?: string;
}

/**
 * Renders the toasts requested with `useToast`. Timers pause while the pointer is over the
 * toasts or focus is inside them, and new toasts are announced by a live region.
 */
export function ToastProvider({
  children,
  duration = 5000,
  max = 3,
  placement = 'bottom-end',
  label = 'Notifications',
  hotkey = 'F8',
  dismissLabel = 'Dismiss notification',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const counter = useRef(0);
  const [list, setList] = useState<HTMLOListElement | null>(null);
  const toastsRef = useRef(toasts);
  const listRef = useRef(list);
  const returnFocus = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    toastsRef.current = toasts;
    listRef.current = list;
  });

  useEffect(() => {
    pendingFocus.current?.focus();
    pendingFocus.current = null;
  }, [toasts]);

  const dismiss = useCallback((id?: string) => {
    const closing = toastsRef.current.filter((toast) => id === undefined || toast.id === id);
    for (const toast of closing) toast.onDismiss?.();

    // Removing the toast that holds focus would drop it on the page body.
    const items = [...(listRef.current?.querySelectorAll<HTMLElement>('[data-toast]') ?? [])];
    const isClosing = (item: HTMLElement) =>
      closing.some((toast) => toast.id === item.dataset.toast);
    if (items.some((item) => isClosing(item) && item.contains(document.activeElement))) {
      const remaining = items.filter((item) => !isClosing(item)).at(-1);
      const previous = returnFocus.current?.isConnected ? returnFocus.current : null;
      pendingFocus.current = previous ?? remaining ?? null;
      if (pendingFocus.current !== remaining) setFocused(false);
    }

    setToasts((current) => (id === undefined ? [] : current.filter((toast) => toast.id !== id)));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = options.id ?? `toast-${++counter.current}`;
    setToasts((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index === -1) return [...current, { ...options, id }];
      return current.map((item, position) => (position === index ? { ...options, id } : item));
    });
    return id;
  }, []);

  useEffect(() => {
    if (!list) return;

    const onHotkey = (event: KeyboardEvent) => {
      if (event.key !== hotkey) return;
      const newest = [...list.querySelectorAll<HTMLElement>('[data-toast]')].at(-1);
      if (!newest) return;
      event.preventDefault();
      if (!list.contains(document.activeElement)) {
        returnFocus.current = document.activeElement as HTMLElement | null;
      }
      newest.focus();
    };
    const onEscape = (event: KeyboardEvent) => {
      const item = (event.target as Element).closest<HTMLElement>('[data-toast]');
      if (event.key !== 'Escape' || !item?.dataset.toast) return;
      event.stopPropagation();
      dismiss(item.dataset.toast);
    };
    const onPointerEnter = () => setHovered(true);
    const onPointerLeave = () => setHovered(false);
    const onFocusIn = () => setFocused(true);
    const onFocusOut = (event: FocusEvent) => {
      if (list.contains(event.relatedTarget as Node | null)) return;
      setFocused(false);
      returnFocus.current = null;
    };

    document.addEventListener('keydown', onHotkey);
    list.addEventListener('keydown', onEscape);
    list.addEventListener('pointerenter', onPointerEnter);
    list.addEventListener('pointerleave', onPointerLeave);
    list.addEventListener('focusin', onFocusIn);
    list.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('keydown', onHotkey);
      list.removeEventListener('keydown', onEscape);
      list.removeEventListener('pointerenter', onPointerEnter);
      list.removeEventListener('pointerleave', onPointerLeave);
      list.removeEventListener('focusin', onFocusIn);
      list.removeEventListener('focusout', onFocusOut);
    };
  }, [list, hotkey, dismiss]);

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  const visible = toasts.slice(0, max);
  const paused = hovered || focused;

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Portal>
        <section aria-label={label} className={cn(styles.viewport, placementClasses[placement])}>
          <ol
            ref={setList}
            className={styles.list}
            aria-live="polite"
            aria-relevant="additions text"
          >
            {visible.map((item) => (
              <ToastItem
                key={item.id}
                toast={item}
                duration={item.duration === undefined ? duration : item.duration}
                paused={paused}
                dismissLabel={dismissLabel}
                onDismiss={() => dismiss(item.id)}
              />
            ))}
          </ol>
        </section>
      </Portal>
    </ToastContext.Provider>
  );
}

const icons: Record<ToastIntent, ReactNode> = {
  neutral: null,
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger: <ErrorIcon />,
};

interface ToastItemProps {
  toast: ToastData;
  duration: number | null;
  paused: boolean;
  dismissLabel: string;
  onDismiss: () => void;
}

function ToastItem({ toast, duration, paused, dismissLabel, onDismiss }: ToastItemProps) {
  const { title, description, intent = 'neutral', action } = toast;
  const remaining = useRef(duration);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  useEffect(() => {
    remaining.current = duration;
  }, [duration, toast]);

  useEffect(() => {
    if (paused || remaining.current === null) return;

    const start = Date.now();
    const timer = setTimeout(() => onDismissRef.current(), remaining.current);
    return () => {
      clearTimeout(timer);
      if (remaining.current !== null) remaining.current -= Date.now() - start;
    };
  }, [paused, duration, toast]);

  return (
    <li
      data-toast={toast.id}
      role={intent === 'danger' ? 'alert' : undefined}
      tabIndex={-1}
      className={cn(styles.toast, styles[intent])}
    >
      {icons[intent] && (
        <span className={styles.icon} aria-hidden="true">
          {icons[intent]}
        </span>
      )}
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {description !== undefined && <div className={styles.description}>{description}</div>}
        {action && (
          <Button
            size="sm"
            variant="secondary"
            className={styles.action}
            onClick={() => {
              action.onClick();
              onDismiss();
            }}
          >
            {action.label}
          </Button>
        )}
      </div>
      <IconButton label={dismissLabel} size="sm" className={styles.dismiss} onClick={onDismiss}>
        <CloseIcon />
      </IconButton>
    </li>
  );
}
