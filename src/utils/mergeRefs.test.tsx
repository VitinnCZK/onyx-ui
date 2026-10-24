import { render } from '@testing-library/react';
import { cloneElement, createRef, forwardRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { getElementRef } from './getElementRef';
import { mergeRefs } from './mergeRefs';

describe('mergeRefs', () => {
  it('assigns the value to object and callback refs', () => {
    const objectRef = createRef<HTMLDivElement>();
    const callbackRef = vi.fn();

    render(<div ref={mergeRefs(objectRef, callbackRef, undefined)} />);

    expect(objectRef.current).toBeInstanceOf(HTMLDivElement);
    expect(callbackRef).toHaveBeenCalledWith(objectRef.current);
  });
});

describe('getElementRef', () => {
  it('reads the ref of an element without warnings', () => {
    const ref = createRef<HTMLButtonElement>();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(getElementRef(<button type="button" ref={ref} />)).toBe(ref);
    expect(getElementRef(<button type="button" />)).toBeUndefined();
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it('lets a wrapper keep the ref of the child it clones', () => {
    const childRef = createRef<HTMLButtonElement>();
    const ownRef = createRef<HTMLButtonElement>();
    const Wrapper = forwardRef<HTMLButtonElement, { children: ReactElement }>(function Wrapper(
      { children },
      ref,
    ) {
      return cloneElement(children as ReactElement<{ ref?: unknown }>, {
        ref: mergeRefs(ref, getElementRef<HTMLButtonElement>(children)),
      });
    });

    render(
      <Wrapper ref={ownRef}>
        <button type="button" ref={childRef} />
      </Wrapper>,
    );

    expect(childRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(ownRef.current).toBe(childRef.current);
  });
});
