import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Checkbox } from '.';

describe('Checkbox', () => {
  it('renders a checkbox named by its label', () => {
    render(<Checkbox>Accept terms</Checkbox>);

    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).not.toBeChecked();
  });

  it('toggles with a click on the label and with Space', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Checkbox onCheckedChange={onCheckedChange} onChange={onChange}>
        Subscribe
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox');

    await user.click(screen.getByText('Subscribe'));
    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);

    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).toHaveBeenLastCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('links the description with aria-describedby', () => {
    render(<Checkbox description="We send one email a week.">Newsletter</Checkbox>);

    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('We send one email a week.');
  });

  it('sets the indeterminate state on the input', () => {
    const { rerender } = render(<Checkbox indeterminate>Select all</Checkbox>);
    const checkbox = screen.getByRole<HTMLInputElement>('checkbox');

    expect(checkbox.indeterminate).toBe(true);

    rerender(<Checkbox>Select all</Checkbox>);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('supports the disabled and invalid states', async () => {
    const onCheckedChange = vi.fn();
    render(
      <>
        <Checkbox disabled onCheckedChange={onCheckedChange}>
          Disabled
        </Checkbox>
        <Checkbox invalid>Invalid</Checkbox>
      </>,
    );

    await userEvent.click(screen.getByText('Disabled'));
    expect(screen.getByRole('checkbox', { name: 'Disabled' })).toBeDisabled();
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox', { name: 'Invalid' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('forwards the ref and applies the size', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(
      <Checkbox ref={ref} size="lg" className="custom">
        Large
      </Checkbox>,
    );

    expect(ref.current).toBe(screen.getByRole('checkbox'));
    expect(container.firstChild).toHaveClass('choice', 'lg', 'custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Checkbox description="Optional">Remember me</Checkbox>
        <Checkbox indeterminate>Select all</Checkbox>
        <Checkbox aria-label="Select row" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
