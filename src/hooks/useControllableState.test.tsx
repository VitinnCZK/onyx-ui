import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useControllableState, type UseControllableStateProps } from './useControllableState';

const setup = (props: UseControllableStateProps<number>) =>
  renderHook((current: UseControllableStateProps<number>) => useControllableState(current), {
    initialProps: props,
  });

describe('useControllableState', () => {
  it('owns the value while uncontrolled', () => {
    const onChange = vi.fn();
    const { result } = setup({ defaultValue: 1, onChange });

    expect(result.current[0]).toBe(1);

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(2);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('follows the value prop while controlled', () => {
    const onChange = vi.fn();
    const { result, rerender } = setup({ value: 5, defaultValue: 1, onChange });

    expect(result.current[0]).toBe(5);

    act(() => result.current[1](6));

    expect(onChange).toHaveBeenCalledWith(6);
    expect(result.current[0]).toBe(5);

    rerender({ value: 6, defaultValue: 1, onChange });

    expect(result.current[0]).toBe(6);
  });

  it('accepts an updater function', () => {
    const onChange = vi.fn();
    const { result } = setup({ value: 10, defaultValue: 0, onChange });

    act(() => result.current[1]((previous) => previous + 1));

    expect(onChange).toHaveBeenCalledWith(11);
  });

  it('skips onChange when the value does not change', () => {
    const onChange = vi.fn();
    const { result } = setup({ defaultValue: 3, onChange });

    act(() => result.current[1](3));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('keeps the uncontrolled value when the defaultValue prop changes', () => {
    const { result, rerender } = setup({ defaultValue: 1 });

    rerender({ defaultValue: 2 });

    expect(result.current[0]).toBe(1);
  });
});
