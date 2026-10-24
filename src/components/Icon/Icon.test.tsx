import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { CheckIcon, Icon } from '.';

describe('Icon', () => {
  it('is hidden from assistive technology without a label', () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('is announced as an image with a label', () => {
    render(<CheckIcon label="Done" />);

    expect(screen.getByRole('img', { name: 'Done' })).not.toHaveAttribute('aria-hidden');
  });

  it('applies the size class and inherits the font size by default', () => {
    const { container } = render(
      <>
        <Icon />
        <Icon size="lg" />
      </>,
    );
    const [inherit, large] = container.querySelectorAll('svg');

    expect(inherit).toHaveClass('icon', 'inherit');
    expect(large).toHaveClass('icon', 'lg');
  });

  it('renders custom shapes and passes props through', () => {
    const { container } = render(
      <Icon className="custom" data-testid="star">
        <circle cx="12" cy="12" r="4" />
      </Icon>,
    );

    expect(screen.getByTestId('star')).toHaveClass('custom');
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('forwards the ref to the svg', () => {
    const ref = createRef<SVGSVGElement>();
    render(<CheckIcon ref={ref} />);

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <p>
        <CheckIcon /> Saved <CheckIcon label="Verified" />
      </p>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
