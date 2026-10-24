import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Select } from '.';

const options = (
  <>
    <option value="br">Brazil</option>
    <option value="pt">Portugal</option>
  </>
);

describe('Select', () => {
  it('renders a native select with a chevron', () => {
    const { container } = render(<Select aria-label="Country">{options}</Select>);
    const select = screen.getByRole('combobox', { name: 'Country' });

    expect(select).toHaveClass('control', 'md', 'select');
    expect(select).toHaveValue('br');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('selects the placeholder until an option is chosen', async () => {
    const onChange = vi.fn();
    render(
      <Select aria-label="Country" placeholder="Choose a country" onChange={onChange}>
        {options}
      </Select>,
    );
    const select = screen.getByRole('combobox');

    expect(select).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Choose a country' })).toBeDisabled();

    await userEvent.selectOptions(select, 'pt');

    expect(select).toHaveValue('pt');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('marks the invalid and disabled states', () => {
    render(
      <>
        <Select aria-label="Invalid" invalid>
          {options}
        </Select>
        <Select aria-label="Disabled" disabled>
          {options}
        </Select>
      </>,
    );

    expect(screen.getByRole('combobox', { name: 'Invalid' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByRole('combobox', { name: 'Disabled' })).toBeDisabled();
  });

  it('supports multiple selection without placeholder or chevron', () => {
    const { container } = render(
      <Select aria-label="Countries" multiple placeholder="ignored">
        {options}
      </Select>,
    );

    expect(screen.getByRole('listbox')).toHaveClass('multiple');
    expect(screen.queryByRole('option', { name: 'ignored' })).not.toBeInTheDocument();
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('forwards the ref and puts className on the wrapper', () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} aria-label="Country" className="custom">
        {options}
      </Select>,
    );

    expect(ref.current).toBe(screen.getByRole('combobox'));
    expect(ref.current?.parentElement).toHaveClass('wrapper', 'custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="country">Country</label>
        <Select id="country" placeholder="Choose a country">
          {options}
        </Select>
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
