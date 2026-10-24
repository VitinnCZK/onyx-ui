import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useClickOutside } from './useClickOutside';

function Layer({
  onClickOutside,
  enabled,
}: {
  onClickOutside: (event: PointerEvent) => void;
  enabled?: boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useClickOutside([panel, trigger], onClickOutside, { enabled });

  return (
    <>
      <button ref={trigger} type="button">
        Trigger
      </button>
      <div ref={panel}>
        <button type="button">Inside</button>
      </div>
      <button type="button">Outside</button>
    </>
  );
}

describe('useClickOutside', () => {
  it('calls the handler when a pointer is pressed outside', async () => {
    const onClickOutside = vi.fn();
    render(<Layer onClickOutside={onClickOutside} />);

    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

    expect(onClickOutside).toHaveBeenCalledOnce();
    expect(onClickOutside.mock.calls[0]?.[0]).toBeInstanceOf(PointerEvent);
  });

  it('ignores presses inside any of the elements', async () => {
    const onClickOutside = vi.fn();
    render(<Layer onClickOutside={onClickOutside} />);

    await userEvent.click(screen.getByRole('button', { name: 'Inside' }));
    await userEvent.click(screen.getByRole('button', { name: 'Trigger' }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('does nothing while disabled', async () => {
    const onClickOutside = vi.fn();
    render(<Layer onClickOutside={onClickOutside} enabled={false} />);

    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));

    expect(onClickOutside).not.toHaveBeenCalled();
  });

  it('accepts a single ref', async () => {
    const onClickOutside = vi.fn();
    function Single() {
      const ref = useRef<HTMLParagraphElement>(null);
      useClickOutside(ref, onClickOutside);
      return <p ref={ref}>Paragraph</p>;
    }
    render(<Single />);

    await userEvent.click(screen.getByText('Paragraph'));
    expect(onClickOutside).not.toHaveBeenCalled();

    await userEvent.click(document.body);
    expect(onClickOutside).toHaveBeenCalledOnce();
  });
});
