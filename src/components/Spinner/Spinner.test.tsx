import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Spinner } from '.';

describe('Spinner', () => {
  it('is a status with a default label', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('uses a custom label', () => {
    render(<Spinner label="Saving changes" />);

    expect(screen.getByRole('status')).toHaveTextContent('Saving changes');
  });

  it('is hidden from assistive technology when decorative', () => {
    const { container } = render(<Spinner decorative />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
    expect(container).not.toHaveTextContent('Loading');
  });

  it('applies the size class and forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} size="lg" className="custom" />);

    expect(ref.current).toHaveClass('spinner', 'lg', 'custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Spinner />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
