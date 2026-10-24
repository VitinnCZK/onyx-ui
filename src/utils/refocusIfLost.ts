/**
 * Focuses `element` once the current event finishes, unless something else took focus. A press
 * outside a layer closes it during `pointerdown`, and the browser then moves focus to whatever
 * was pressed: the page body when it was not focusable, which would strand keyboard users.
 */
export function refocusIfLost(element: HTMLElement | null | undefined): void {
  setTimeout(() => {
    const active = document.activeElement;
    if (element?.isConnected && (!active || active === document.body)) element.focus();
  });
}
