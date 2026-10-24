import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Button } from '../Button';
import { Drawer } from '.';

describe('Drawer', () => {
  it('opens from the trigger at the end edge by default', async () => {
    render(
      <Drawer title="Filters" trigger={<Button>Filters</Button>}>
        <p>Content</p>
      </Drawer>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Filters' }));
    const dialog = screen.getByRole('dialog', { name: 'Filters' });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveClass('panel', 'sm');
    expect(dialog.parentElement).toHaveClass('root', 'end');
  });

  it('traps focus and returns it to the trigger on close', async () => {
    const user = userEvent.setup();
    render(
      <Drawer title="Menu" trigger={<Button>Menu</Button>} footer={<Button>Apply</Button>}>
        <a href="#home">Home</a>
      </Drawer>,
    );
    const trigger = screen.getByRole('button', { name: 'Menu' });

    await user.click(trigger);
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.tab();
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('applies the placement and size and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Drawer ref={ref} title="Details" placement="bottom" size="lg" defaultOpen />);

    expect(ref.current).toHaveClass('lg');
    expect(ref.current?.parentElement).toHaveClass('bottom');
  });

  it('closes with Escape', async () => {
    render(<Drawer title="Details" defaultOpen />);

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    render(
      <Drawer title="Settings" description="Changes save automatically." defaultOpen>
        <label>
          Name <input />
        </label>
      </Drawer>,
    );

    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
