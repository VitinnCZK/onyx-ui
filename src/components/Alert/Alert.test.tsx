import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Alert } from '.';

describe('Alert', () => {
  it('renders an info status named by its title', () => {
    render(<Alert title="Update available">Restart to apply it.</Alert>);
    const alert = screen.getByRole('status', { name: 'Update available' });

    expect(alert).toHaveTextContent('Restart to apply it.');
    expect(alert).toHaveClass('alert', 'info', 'subtle');
  });

  it('uses role alert for warnings and errors', () => {
    render(
      <>
        <Alert intent="warning">Storage almost full.</Alert>
        <Alert intent="danger" variant="solid">
          Payment failed.
        </Alert>
      </>,
    );

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.getByText('Payment failed.').closest('[role="alert"]')).toHaveClass('solid');
  });

  it('lets the role be overridden', () => {
    render(
      <Alert intent="danger" role="note">
        Static note.
      </Alert>,
    );

    expect(screen.getByRole('note')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the intent icon unless replaced or hidden', () => {
    const { container, rerender } = render(<Alert>Message</Alert>);
    expect(container.querySelector('svg')).toBeInTheDocument();

    rerender(<Alert icon={<svg data-testid="custom" />}>Message</Alert>);
    expect(screen.getByTestId('custom')).toBeInTheDocument();

    rerender(<Alert icon={false}>Message</Alert>);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders an action and a dismiss button', async () => {
    const onDismiss = vi.fn();
    render(
      <Alert
        onDismiss={onDismiss}
        dismissLabel="Close"
        action={<button type="button">Undo</button>}
      >
        Item deleted.
      </Alert>,
    );

    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Message</Alert>);

    expect(ref.current).toBe(screen.getByRole('status'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <Alert title="Saved" intent="success" onDismiss={() => {}}>
          Your changes were saved.
        </Alert>
        <Alert intent="danger" variant="solid" title="Error">
          Something went wrong.
        </Alert>
      </main>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
