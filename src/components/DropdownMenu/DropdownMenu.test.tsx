import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Button } from '../Button';
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  type DropdownMenuProps,
} from '.';

function Example({
  onSelect = () => {},
  ...props
}: Partial<DropdownMenuProps> & { onSelect?: (value: string) => void }) {
  return (
    <>
      <DropdownMenu trigger={<Button>Actions</Button>} {...props}>
        <DropdownMenuItem onSelect={() => onSelect('edit')} shortcut="⌘E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect('duplicate')}>Duplicate</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect('archive')} disabled>
          Archive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup label="Danger zone">
          <DropdownMenuItem onSelect={() => onSelect('delete')} destructive>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenu>
      <button type="button">After</button>
    </>
  );
}

const items = () => screen.getAllByRole('menuitem');

describe('DropdownMenu', () => {
  it('opens a menu labelled by its button and focuses the first item', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    const menu = screen.getByRole('menu', { name: 'Actions' });

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', menu.id);
    expect(items()[0]).toHaveFocus();
    expect(items()[0]).toHaveAttribute('tabindex', '-1');
  });

  it('opens on the first item with ArrowDown and on the last with ArrowUp', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await user.keyboard('{Escape}');
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('moves with the arrow keys, wraps around and supports Home and End', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus();

    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('focuses the next item that starts with the typed characters', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    await user.keyboard('d');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();

    await user.keyboard('x');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
  });

  it('runs an item with Enter, Space or a click, then closes and refocuses the button', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    await user.click(trigger);
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenLastCalledWith('edit');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.keyboard('{ArrowDown}{ArrowDown}');
    await user.keyboard(' ');
    expect(onSelect).toHaveBeenLastCalledWith('duplicate');

    await user.click(trigger);
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }));
    expect(onSelect).toHaveBeenLastCalledWith('delete');
  });

  it('keeps disabled items focusable but does not run them', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);

    await user.click(screen.getByRole('button', { name: 'Actions' }));
    const archive = screen.getByRole('menuitem', { name: 'Archive' });
    await user.click(archive);

    expect(archive).toHaveAttribute('aria-disabled', 'true');
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('closes with Escape, Tab and a click outside', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    await user.click(trigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();

    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();

    await user.click(trigger);
    await user.click(document.body);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('groups items under a label', async () => {
    render(<Example defaultOpen />);

    expect(screen.getByRole('group', { name: 'Danger zone' })).toContainElement(
      screen.getByRole('menuitem', { name: 'Delete' }),
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('works as a controlled component and keeps the trigger ref', async () => {
    const onOpenChange = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <DropdownMenu
        open={false}
        onOpenChange={onOpenChange}
        trigger={<Button ref={ref}>More</Button>}
      >
        <DropdownMenuItem>Item</DropdownMenuItem>
      </DropdownMenu>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'More' }));

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(ref.current).toBe(screen.getByRole('button', { name: 'More' }));
  });

  it('throws when an item is rendered outside a menu', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<DropdownMenuItem>Orphan</DropdownMenuItem>)).toThrow(
      /inside a DropdownMenu/,
    );
    vi.restoreAllMocks();
  });

  it('has no accessibility violations while open', async () => {
    render(
      <main>
        <Example defaultOpen />
      </main>,
    );

    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
