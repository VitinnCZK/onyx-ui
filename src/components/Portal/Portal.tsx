import { useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children?: ReactNode;
  /**
   * Node the children are rendered into. `null` renders nothing, e.g. while a ref is not attached.
   * @default document.body
   */
  container?: Element | DocumentFragment | null;
}

const subscribe = () => () => {};

export function Portal({ children, container }: PortalProps) {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  const target = container === undefined ? document.body : container;
  return target ? createPortal(children, target) : null;
}
