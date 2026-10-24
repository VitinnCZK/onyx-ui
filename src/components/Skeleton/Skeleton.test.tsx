import { render } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Skeleton } from '.';

describe('Skeleton', () => {
  it('renders a hidden line of text by default', () => {
    const { container } = render(<Skeleton />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveClass('skeleton', 'text');
  });

  it('applies the variant and size', () => {
    const { container } = render(<Skeleton variant="circle" width={48} height="3rem" />);
    const skeleton = container.firstChild as HTMLElement;

    expect(skeleton).toHaveClass('circle');
    expect(skeleton.style.width).toBe('48px');
    expect(skeleton.style.height).toBe('3rem');
  });

  it('ignores the height of text', () => {
    const { container } = render(<Skeleton height={100} />);

    expect((container.firstChild as HTMLElement).style.height).toBe('');
  });

  it('draws several lines of text', () => {
    const { container } = render(<Skeleton lines={3} width="20rem" className="custom" />);
    const group = container.firstChild as HTMLElement;

    expect(group).toHaveClass('lines', 'custom');
    expect(group.style.width).toBe('20rem');
    expect(group.children).toHaveLength(3);
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} variant="rect" />);

    expect(ref.current).toHaveClass('rect');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <div aria-busy="true" aria-label="Loading profile" role="group">
        <Skeleton variant="circle" />
        <Skeleton lines={2} />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
