import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Progress } from '.';

describe('Progress', () => {
  it('renders a progressbar named by its label with the current value', () => {
    render(<Progress label="Uploading" value={30} />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading' });

    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuetext', '30%');
  });

  it('is indeterminate without a value', () => {
    render(<Progress aria-label="Loading" />);
    const bar = screen.getByRole('progressbar', { name: 'Loading' });

    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).not.toHaveAttribute('aria-valuetext');
    expect(bar).toHaveAttribute('data-indeterminate');
  });

  it('clamps the value and fills the bar in proportion to max', () => {
    const { rerender } = render(<Progress aria-label="Steps" value={3} max={4} />);
    const fill = () => screen.getByRole('progressbar').firstElementChild as HTMLElement;

    expect(fill().style.getPropertyValue('--progress-value')).toBe('0.75');

    rerender(<Progress aria-label="Steps" value={9} max={4} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '4');
  });

  it('shows a formatted value that is hidden from assistive technology', () => {
    render(
      <Progress
        label="Steps"
        value={2}
        max={5}
        showValue
        formatValue={(value, max) => `Step ${value} of ${max}`}
      />,
    );

    expect(screen.getByText('Step 2 of 5')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', 'Step 2 of 5');
  });

  it('applies size and intent to the outer box and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Progress
        ref={ref}
        aria-label="Disk"
        value={90}
        size="lg"
        intent="danger"
        className="custom"
      />,
    );

    expect(ref.current).toBe(screen.getByRole('progressbar'));
    expect(ref.current?.parentElement).toHaveClass('progress', 'lg', 'danger', 'custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Progress label="Profile completion" value={60} showValue />
        <Progress aria-label="Loading results" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
