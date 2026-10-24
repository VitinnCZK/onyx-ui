import { useEffect, useMemo, useRef } from 'react';

/** One pending timeout at a time, cleared on unmount. */
export function useTimeout() {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return useMemo(
    () => ({
      set(callback: () => void, delay: number) {
        clearTimeout(timer.current);
        timer.current = setTimeout(callback, delay);
      },
      clear() {
        clearTimeout(timer.current);
      },
    }),
    [],
  );
}
