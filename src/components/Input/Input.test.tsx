import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Input } from '.';

describe('Input', () => {
  it('renders a text input inside a medium box', () => {
    render(<Input aria-label="Name" />);
    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input).toHaveAttribute('type', 'text');
    expect(input.parentElement).toHaveClass('control', 'md');
  });

  it('accepts typing and calls onChange', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'Ada');

    expect(screen.getByRole('textbox')).toHaveValue('Ada');
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('marks the invalid and disabled states', () => {
    render(
      <>
        <Input aria-label="Invalid" invalid />
        <Input aria-label="Disabled" disabled />
      </>,
    );
    const invalid = screen.getByRole('textbox', { name: 'Invalid' });
    const disabled = screen.getByRole('textbox', { name: 'Disabled' });

    expect(invalid).toHaveAttribute('aria-invalid', 'true');
    expect(invalid.parentElement).toHaveAttribute('data-invalid');
    expect(disabled).toBeDisabled();
    expect(disabled.parentElement).toHaveAttribute('data-disabled');
  });

  it('renders adornments and puts className and style on the box', () => {
    render(
      <Input
        aria-label="Price"
        className="custom"
        style={{ maxWidth: '10rem' }}
        startAdornment="$"
        endAdornment="USD"
        size="lg"
      />,
    );
    const box = screen.getByRole('textbox').parentElement!;

    expect(box).toHaveClass('custom', 'lg');
    expect(box.style.maxWidth).toBe('10rem');
    expect(box).toHaveTextContent('$USD');
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Name" />);

    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="search">Search</label>
        <Input id="search" type="search" startAdornment="🔍" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
