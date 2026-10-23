import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from './axe';

// Smoke test for the testing toolchain: Testing Library, user-event, jest-dom and axe.
describe('test setup', () => {
  it('renders, handles interaction and runs axe', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <button type="button" onClick={onClick}>
        Click me
      </button>,
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    expect(await axe(container)).toHaveNoViolations();
  });

  it('reports accessibility violations', async () => {
    const { container } = render(<button type="button" />);

    expect(await axe(container)).not.toHaveNoViolations();
  });
});
