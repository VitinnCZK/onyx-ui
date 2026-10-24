import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Button } from '.';

describe('Button', () => {
  it('renders a button of type button with the default variant and size', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('button', 'primary', 'md');
  });

  it('applies the variant, size and full width classes', () => {
    render(
      <Button variant="danger" size="lg" fullWidth>
        Delete
      </Button>,
    );

    expect(screen.getByRole('button')).toHaveClass('danger', 'lg', 'fullWidth');
  });

  it('calls onClick when activated with the mouse or keyboard', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('stays focusable but ignores clicks and form submission while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <Button type="submit" loading loadingLabel="Saving" onClick={onClick}>
          Save
        </Button>
      </form>,
    );
    const button = screen.getByRole('button', { name: 'Save Saving' });

    await user.tab();
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-disabled', 'true');

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders icons around the label', () => {
    render(
      <Button startIcon={<svg data-testid="start" />} endIcon={<svg data-testid="end" />}>
        Next
      </Button>,
    );

    expect(screen.getByRole('button')).toContainElement(screen.getByTestId('start'));
    expect(screen.getByRole('button')).toContainElement(screen.getByTestId('end'));
  });

  it('forwards the ref and merges className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="custom">
        Save
      </Button>,
    );

    expect(ref.current).toBe(screen.getByRole('button'));
    expect(ref.current).toHaveClass('button', 'custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Button>Save</Button>
        <Button variant="outline" disabled>
          Disabled
        </Button>
        <Button variant="secondary" loading>
          Loading
        </Button>
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
