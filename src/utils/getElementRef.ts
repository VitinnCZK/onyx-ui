import type { ReactElement, Ref } from 'react';

/** Reads the ref of an element: a prop since React 19, a field of the element before. */
export function getElementRef<T>(element: ReactElement): Ref<T> | undefined {
  const props = element.props as { ref?: Ref<T> };
  const descriptor = Object.getOwnPropertyDescriptor(props, 'ref');
  const warnsOnAccess = descriptor?.get && 'isReactWarning' in descriptor.get;

  if (descriptor && !warnsOnAccess) return props.ref;
  return (element as unknown as { ref?: Ref<T> }).ref ?? undefined;
}
