import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Button } from '../Button';
import { Popover, type PopoverProps } from '.';

function Example(props: Partial<PopoverProps>) {
  return (
    <>
      <Popover title="Share" trigger={<Button>Share</Button>} {...props}>
        <input aria-label="Link" defaultValue="https://example.com" />
        <Button>Copy</Button>
      </Popover>
      <button type="button">After</button>
    </>
  );
}

describe('Popover', () => {
  it('toggles a labelled dialog from the trigger', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Share' });

    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Share' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(dialog).not.toHaveAttribute('aria-modal');

    await userEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('moves focus inside on open and back to the trigger on Escape', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Share' });

    await user.click(trigger);
    expect(screen.getByRole('textbox', { name: 'Link' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes when focus leaves it with Tab', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Share' }));
    await user.tab();
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveFocus();

    await user.tab();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('closes on a click outside', async () => {
    render(<Example defaultOpen />);

    await userEvent.click(document.body);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('focuses the initial focus element and has a close button', async () => {
    function WithInitialFocus() {
      const copy = useRef<HTMLButtonElement>(null);
      return (
        <Popover
          aria-label="Share options"
          trigger={<Button>Share</Button>}
          initialFocus={copy}
          showClose
          defaultOpen
        >
          <Button ref={copy}>Copy link</Button>
        </Popover>
      );
    }
    render(<WithInitialFocus />);

    expect(screen.getByRole('dialog', { name: 'Share options' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveFocus();

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share' })).toHaveFocus();
  });

  it('works as a controlled component and keeps the trigger handlers and ref', async () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn();
    const triggerRef = createRef<HTMLButtonElement>();
    const panelRef = createRef<HTMLDivElement>();
    render(
      <Popover
        ref={panelRef}
        aria-label="Info"
        open
        onOpenChange={onOpenChange}
        trigger={
          <Button ref={triggerRef} onClick={onClick}>
            Info
          </Button>
        }
      >
        Details
      </Popover>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Info' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBe(panelRef.current);
    expect(triggerRef.current).toBe(screen.getByRole('button', { name: 'Info' }));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Example defaultOpen />
      </main>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
