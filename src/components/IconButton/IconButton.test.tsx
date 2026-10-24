import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { CloseIcon } from '../Icon';
import { IconButton } from '.';

describe('IconButton', () => {
  it('is named by its label and defaults to the ghost variant', () => {
    render(
      <IconButton label="Close">
        <CloseIcon />
      </IconButton>,
    );
    const button = screen.getByRole('button', { name: 'Close' });

    expect(button).toHaveClass('button', 'ghost', 'iconButton', 'md');
  });

  it('calls onClick and forwards the ref', async () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} label="Close" variant="primary" size="sm" onClick={onClick}>
        <CloseIcon />
      </IconButton>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledOnce();
    expect(ref.current).toHaveClass('primary', 'sm');
  });

  it('supports the disabled and loading states', () => {
    render(
      <>
        <IconButton label="Delete" disabled>
          <CloseIcon />
        </IconButton>
        <IconButton label="Refresh" loading>
          <CloseIcon />
        </IconButton>
      </>,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Refresh' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <IconButton label="Close">
        <CloseIcon />
      </IconButton>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
