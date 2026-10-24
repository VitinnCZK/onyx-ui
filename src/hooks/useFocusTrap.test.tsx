import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useRef, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { useFocusTrap, type UseFocusTrapOptions } from './useFocusTrap';

function Trap({
  label,
  children,
  focusSave,
  ...options
}: Omit<UseFocusTrapOptions, 'initialFocus'> & {
  label: string;
  children?: ReactNode;
  focusSave?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const save = useRef<HTMLButtonElement>(null);
  useFocusTrap(ref, { ...options, initialFocus: focusSave ? save : undefined });

  return (
    <div ref={ref} role="group" aria-label={label} tabIndex={-1}>
      {children ?? (
        <>
          <button type="button">First</button>
          <button type="button" disabled>
            Disabled
          </button>
          <button ref={save} type="button">
            Save
          </button>
          <span tabIndex={-1}>Not tabbable</span>
          <button type="button">Last</button>
          <div inert>
            <button type="button">Inert</button>
          </div>
        </>
      )}
    </div>
  );
}

function Page({ trap, ...props }: Parameters<typeof Trap>[0] & { trap: boolean }) {
  return (
    <>
      <button type="button">Before</button>
      {trap && <Trap {...props} />}
      <button type="button">After</button>
    </>
  );
}

const button = (name: string) => screen.getByRole('button', { name });

describe('useFocusTrap', () => {
  it('moves focus to the first tabbable element', () => {
    render(<Trap label="Dialog" />);

    expect(button('First')).toHaveFocus();
  });

  it('moves focus to initialFocus when given', () => {
    render(<Trap label="Dialog" focusSave />);

    expect(button('Save')).toHaveFocus();
  });

  it('focuses the container when it has nothing tabbable', () => {
    render(
      <Trap label="Empty">
        <p>No controls</p>
      </Trap>,
    );

    expect(screen.getByRole('group', { name: 'Empty' })).toHaveFocus();
  });

  it('wraps Tab and Shift+Tab around the tabbable elements', async () => {
    render(<Page trap label="Dialog" />);

    await userEvent.tab();
    expect(button('Save')).toHaveFocus();

    await userEvent.tab();
    expect(button('Last')).toHaveFocus();

    await userEvent.tab();
    expect(button('First')).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(button('Last')).toHaveFocus();
  });

  it('brings focus back when it moves outside', () => {
    render(<Page trap label="Dialog" />);
    act(() => button('Last').focus());

    act(() => button('After').focus());

    expect(button('Last')).toHaveFocus();
  });

  it('returns focus to the previously focused element when disabled', () => {
    const { rerender } = render(<Page trap={false} label="Dialog" />);
    act(() => button('Before').focus());

    rerender(<Page trap label="Dialog" />);
    expect(button('First')).toHaveFocus();

    rerender(<Page trap={false} label="Dialog" />);
    expect(button('Before')).toHaveFocus();
  });

  it('leaves focus alone when returnFocus is false', () => {
    const { rerender } = render(<Page trap={false} label="Dialog" returnFocus={false} />);
    act(() => button('Before').focus());

    rerender(<Page trap label="Dialog" returnFocus={false} />);
    rerender(<Page trap={false} label="Dialog" returnFocus={false} />);

    expect(button('Before')).not.toHaveFocus();
  });

  it('does nothing while disabled', async () => {
    render(<Page trap label="Dialog" enabled={false} />);

    expect(document.body).toHaveFocus();

    await userEvent.tab();
    expect(button('Before')).toHaveFocus();
  });

  it('pauses the outer trap while a nested one is active', async () => {
    function Nested({ open }: { open: boolean }) {
      return (
        <>
          <Trap label="Outer">
            <button type="button">Outer action</button>
          </Trap>
          {open && (
            <Trap label="Inner">
              <button type="button">Inner action</button>
              <button type="button">Inner close</button>
            </Trap>
          )}
        </>
      );
    }
    const { rerender } = render(<Nested open={false} />);
    expect(button('Outer action')).toHaveFocus();

    rerender(<Nested open />);
    expect(button('Inner action')).toHaveFocus();

    await userEvent.tab();
    await userEvent.tab();
    expect(button('Inner action')).toHaveFocus();

    rerender(<Nested open={false} />);
    expect(button('Outer action')).toHaveFocus();
  });
});
