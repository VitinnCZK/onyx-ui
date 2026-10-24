import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Switch } from '.';

describe('Switch', () => {
  it('renders a switch named by its label', () => {
    render(<Switch>Wi-Fi</Switch>);

    expect(screen.getByRole('switch', { name: 'Wi-Fi' })).not.toBeChecked();
  });

  it('toggles with a click and with Space', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch onCheckedChange={onCheckedChange}>Wi-Fi</Switch>);
    const toggle = screen.getByRole('switch');

    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    await user.keyboard(' ');
    expect(toggle).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
  });

  it('supports defaultChecked, a description and the disabled state', async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        defaultChecked
        disabled
        description="Managed by your organization"
        onCheckedChange={onCheckedChange}
      >
        Sync
      </Switch>,
    );
    const toggle = screen.getByRole('switch');

    await userEvent.click(toggle);

    expect(toggle).toBeChecked();
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAccessibleDescription('Managed by your organization');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('forwards the ref and applies the size', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Switch ref={ref} size="sm" aria-label="Dark mode" />);

    expect(ref.current).toBe(screen.getByRole('switch', { name: 'Dark mode' }));
    expect(container.firstChild).toHaveClass('choice', 'sm', 'switch');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Switch defaultChecked>Notifications</Switch>
        <Switch aria-label="Airplane mode" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
