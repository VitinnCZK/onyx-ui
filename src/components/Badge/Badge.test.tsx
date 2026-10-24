import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Badge } from '.';

describe('Badge', () => {
  it('renders a neutral subtle badge by default', () => {
    render(<Badge>Draft</Badge>);

    expect(screen.getByText('Draft')).toHaveClass('badge', 'neutral', 'subtle', 'md');
  });

  it('applies the intent, variant and size', () => {
    render(
      <Badge intent="success" variant="solid" size="sm">
        Active
      </Badge>,
    );

    expect(screen.getByText('Active')).toHaveClass('success', 'solid', 'sm');
  });

  it('renders an icon and forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} icon={<svg data-testid="icon" aria-hidden="true" />}>
        New
      </Badge>,
    );

    expect(ref.current).toContainElement(screen.getByTestId('icon'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <p>
        Status: <Badge intent="warning">Pending</Badge>
      </p>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
