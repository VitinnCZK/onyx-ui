import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Divider } from '.';

describe('Divider', () => {
  it('renders a horizontal separator by default', () => {
    render(<Divider />);
    const separator = screen.getByRole('separator');

    expect(separator.tagName).toBe('HR');
    expect(separator).toHaveClass('divider', 'horizontal', 'md');
  });

  it('renders a vertical separator', () => {
    render(<Divider orientation="vertical" spacing="sm" />);
    const separator = screen.getByRole('separator');

    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    expect(separator).toHaveClass('vertical', 'sm');
  });

  it('is hidden from assistive technology when decorative', () => {
    render(
      <>
        <Divider decorative />
        <Divider orientation="vertical" decorative />
      </>,
    );

    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Divider ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Divider />
        <p>Below</p>
        <Divider orientation="vertical" />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
