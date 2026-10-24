import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Input } from '../Input';
import { Select } from '../Select';
import { Slider } from '../Slider';
import { Textarea } from '../Textarea';
import { FormField } from '.';

describe('FormField', () => {
  it('labels the control and describes it with the helper text', () => {
    render(
      <FormField label="Email" helperText="We never share it.">
        <Input type="email" />
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAccessibleDescription('We never share it.');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('marks the control invalid and describes it with the error', () => {
    render(
      <FormField label="Email" helperText="We never share it." error="Enter a valid email.">
        <Input type="email" aria-describedby="extra" />
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('We never share it. Enter a valid email.');
    expect(input.getAttribute('aria-describedby')).toMatch(/-helper .*-error extra$/);
    expect(input.parentElement).toHaveAttribute('data-invalid');
  });

  it('passes required and disabled to the control and the label', () => {
    render(
      <FormField label="Name" required disabled>
        <Input />
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input).toBeRequired();
    expect(input).toBeDisabled();
    expect(screen.getByText('Name').closest('label')).toHaveAttribute('data-disabled');
  });

  it('lets the control override the field state', () => {
    render(
      <FormField label="Name" controlId="custom-id" error="Required">
        <Input invalid={false} />
      </FormField>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });

    expect(input).toHaveAttribute('id', 'custom-id');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('wires up every field control', () => {
    render(
      <>
        <FormField label="Bio">
          <Textarea />
        </FormField>
        <FormField label="Country">
          <Select>
            <option>Brazil</option>
          </Select>
        </FormField>
        <FormField label="Volume">
          <Slider />
        </FormField>
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Bio' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Country' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
  });

  it('can hide the label visually', () => {
    render(
      <FormField label="Search" hideLabel>
        <Input type="search" />
      </FormField>,
    );

    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByText('Search').closest('.visuallyHidden')).not.toBeNull();
  });

  it('forwards the ref to the wrapper', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <FormField ref={ref} label="Name" className="custom">
        <Input />
      </FormField>,
    );

    expect(ref.current).toHaveClass('field', 'custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <FormField label="Password" helperText="At least 8 characters." error="Too short." required>
        <Input type="password" />
      </FormField>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
