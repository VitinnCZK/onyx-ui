import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

export interface UseControllableStateProps<T> {
  /** Controlled value. While it is not `undefined`, the hook never changes it on its own. */
  value?: T;
  /** Initial value while uncontrolled. */
  defaultValue: T;
  /** Called with every new value, controlled or not. */
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : uncontrolledValue;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const resolved = typeof next === 'function' ? (next as (previous: T) => T)(current) : next;
      if (Object.is(resolved, current)) return;

      if (!isControlled) setUncontrolledValue(resolved);
      onChange?.(resolved);
    },
    [current, isControlled, onChange],
  );

  return [current, setValue];
}
