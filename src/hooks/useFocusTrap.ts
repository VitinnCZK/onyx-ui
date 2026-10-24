import { useEffect, type RefObject } from 'react';
import { useLatestRef } from './useLatestRef';

export interface UseFocusTrapOptions {
  /** @default true */
  enabled?: boolean;
  /** Element focused on activation. Defaults to the first tabbable element, then the container. */
  initialFocus?: RefObject<HTMLElement | null>;
  /**
   * Moves focus back to the element that had it before the trap activated.
   * @default true
   */
  returnFocus?: boolean;
}

const tabbableSelector = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'iframe',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',');

function getTabbable(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(tabbableSelector)].filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.matches(':disabled') &&
      !element.closest('[inert]') &&
      (element.checkVisibility?.({ visibilityProperty: true }) ?? true),
  );
}

const traps: object[] = [];

/**
 * Keeps keyboard focus inside the element in `ref` while enabled. Give the container
 * `tabIndex={-1}` so it can hold focus when it has nothing tabbable. Nested traps pause the
 * outer one until they are disabled.
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  { enabled = true, initialFocus, returnFocus = true }: UseFocusTrapOptions = {},
): void {
  const options = useLatestRef({ initialFocus, returnFocus });

  useEffect(() => {
    const container = ref.current;
    if (!enabled || !container) return;

    const trap = {};
    traps.push(trap);
    const previouslyFocused = document.activeElement;
    let lastFocused: HTMLElement | null = null;

    const focusFirst = () =>
      (options.current.initialFocus?.current ?? getTabbable(container)[0] ?? container).focus();

    const restoreFocus = () => {
      if (!options.current.returnFocus || !(previouslyFocused instanceof HTMLElement)) return;
      if (previouslyFocused.isConnected) previouslyFocused.focus();
    };

    if (!container.contains(document.activeElement)) focusFirst();

    const onFocusIn = (event: FocusEvent) => {
      if (traps.at(-1) !== trap) return;

      if (container.contains(event.target as Node)) {
        lastFocused = event.target as HTMLElement;
      } else if (lastFocused && container.contains(lastFocused)) {
        lastFocused.focus();
      } else {
        focusFirst();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || traps.at(-1) !== trap) return;

      const tabbable = getTabbable(container);
      const first = tabbable[0];
      const last = tabbable.at(-1);
      const active = document.activeElement;

      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onKeyDown);
      traps.splice(traps.indexOf(trap), 1);
      restoreFocus();
    };
  }, [enabled, ref, options]);
}
