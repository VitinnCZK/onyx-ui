import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Textarea } from '.';

describe('Textarea', () => {
  it('renders a textarea with three rows that resizes vertically', () => {
    render(<Textarea aria-label="Message" />);
    const textarea = screen.getByRole('textbox', { name: 'Message' });

    expect(textarea).toHaveAttribute('rows', '3');
    expect(textarea).toHaveClass('control', 'md', 'textarea', 'vertical');
  });

  it('accepts multi-line text', async () => {
    render(<Textarea aria-label="Message" />);

    await userEvent.type(screen.getByRole('textbox'), 'Hello{Enter}world');

    expect(screen.getByRole('textbox')).toHaveValue('Hello\nworld');
  });

  it('marks the invalid and disabled states', () => {
    render(
      <>
        <Textarea aria-label="Invalid" invalid />
        <Textarea aria-label="Disabled" disabled />
      </>,
    );

    expect(screen.getByRole('textbox', { name: 'Invalid' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
  });

  it('grows with its content from the given rows when autoResize is set', () => {
    render(<Textarea aria-label="Notes" autoResize rows={5} resize="none" />);
    const textarea = screen.getByRole('textbox');

    expect(textarea).toHaveClass('autoResize', 'none');
    expect(textarea.style.getPropertyValue('--textarea-rows')).toBe('5');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" />);

    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="bio">Bio</label>
        <Textarea id="bio" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
