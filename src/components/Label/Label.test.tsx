import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Label } from '.';

describe('Label', () => {
  it('labels the control it points to', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" type="email" />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('shows a required marker that is not part of the name', () => {
    render(
      <>
        <Label htmlFor="name" required>
          Name
        </Label>
        <input id="name" required />
      </>,
    );

    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeRequired();
  });

  it('marks the disabled state, applies the size and forwards the ref', () => {
    const ref = createRef<HTMLLabelElement>();
    render(
      <Label ref={ref} disabled size="sm">
        Disabled
      </Label>,
    );

    expect(ref.current).toHaveAttribute('data-disabled');
    expect(ref.current).toHaveClass('label', 'sm');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Label htmlFor="city" required>
          City
        </Label>
        <input id="city" required />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
