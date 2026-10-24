import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { EmptyState } from '.';

describe('EmptyState', () => {
  it('renders the title as an h3 with the description', () => {
    render(<EmptyState title="No projects yet" description="Create one to get started." />);

    expect(screen.getByRole('heading', { level: 3, name: 'No projects yet' })).toBeInTheDocument();
    expect(screen.getByText('Create one to get started.')).toBeInTheDocument();
  });

  it('hides the icon from assistive technology and renders the action', () => {
    render(
      <EmptyState
        title="No results"
        icon={<svg data-testid="icon" />}
        action={<button type="button">Clear filters</button>}
      />,
    );

    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('uses the heading level and size and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="Empty" headingLevel={2} size="sm" />);

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(ref.current).toHaveClass('emptyState', 'sm');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <EmptyState
        title="No messages"
        description="When someone writes to you, it shows up here."
        action={<button type="button">Write a message</button>}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
