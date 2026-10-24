import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Button } from '../Button';
import { Modal, type ModalProps } from '.';

function Uncontrolled(props: Partial<ModalProps>) {
  return (
    <Modal
      title="Delete project"
      description="This cannot be undone."
      trigger={<Button>Open</Button>}
      footer={<Button variant="danger">Delete</Button>}
      {...props}
    >
      <input aria-label="Project name" />
    </Modal>
  );
}

describe('Modal', () => {
  it('opens from the trigger as a labelled, described modal dialog', async () => {
    render(<Uncontrolled />);
    const trigger = screen.getByRole('button', { name: 'Open' });

    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Delete project' });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('moves focus inside, traps Tab and returns focus on Escape', async () => {
    const user = userEvent.setup();
    render(<Uncontrolled />);
    const trigger = screen.getByRole('button', { name: 'Open' });

    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('focuses the initial focus element', async () => {
    function WithInitialFocus() {
      const input = useRef<HTMLInputElement>(null);
      return (
        <Modal title="Rename" defaultOpen initialFocus={input}>
          <input ref={input} aria-label="Name" />
        </Modal>
      );
    }
    render(<WithInitialFocus />);

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  });

  it('locks the page scroll while open', async () => {
    render(<Uncontrolled />);

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(document.body.style.overflow).toBe('hidden');

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on an overlay click but not on a click inside', async () => {
    render(<Uncontrolled defaultOpen />);
    const dialog = screen.getByRole('dialog');

    await userEvent.click(screen.getByRole('textbox'));
    expect(dialog).toBeInTheDocument();

    await userEvent.click(dialog.previousElementSibling!);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('can ignore the overlay click and Escape', async () => {
    render(<Uncontrolled defaultOpen closeOnOverlayClick={false} closeOnEscape={false} />);
    const dialog = screen.getByRole('dialog');

    await userEvent.click(dialog.previousElementSibling!);
    await userEvent.keyboard('{Escape}');

    expect(dialog).toBeInTheDocument();
  });

  it('works as a controlled component', async () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Edit</Button>
          <Modal
            title="Edit"
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next);
              setOpen(next);
            }}
          />
        </>
      );
    }
    render(<Controlled />);

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('dialog', { name: 'Edit' })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports alertdialog, sizes, a hidden close button and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Modal
        ref={ref}
        title="Discard changes?"
        role="alertdialog"
        size="sm"
        defaultOpen
        hideCloseButton
      >
        <Button>Discard</Button>
      </Modal>,
    );
    const dialog = screen.getByRole('alertdialog', { name: 'Discard changes?' });

    expect(ref.current).toBe(dialog);
    expect(dialog).toHaveClass('panel', 'sm');
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    render(<Uncontrolled defaultOpen />);

    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
