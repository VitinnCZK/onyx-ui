import { render, screen, within } from '@testing-library/react';
import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '.';

function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="/docs/button" current>
          Button
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

describe('Breadcrumb', () => {
  it('renders a labelled navigation with an ordered list of links', () => {
    render(<Example />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });

    expect(within(nav).getByRole('list').tagName).toBe('OL');
    expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
    expect(within(nav).getAllByRole('link')).toHaveLength(3);
  });

  it('marks the current page', () => {
    render(<Example />);

    expect(screen.getByRole('link', { name: 'Button' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Docs' })).not.toHaveAttribute('aria-current');
  });

  it('hides the separators from assistive technology', () => {
    render(<Example />);

    for (const item of screen.getAllByRole('listitem')) {
      expect(item.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    }
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAccessibleName('Home');
  });

  it('accepts a custom separator, label and router links', () => {
    const RouterLink = forwardRef<
      HTMLAnchorElement,
      AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
    >(function RouterLink({ to, children, ...props }, ref) {
      return (
        <a ref={ref} href={to} {...props}>
          {children}
        </a>
      );
    });
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Breadcrumb separator="/" aria-label="You are here">
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/settings" ref={ref}>
            Settings
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(screen.getByRole('navigation', { name: 'You are here' })).toHaveTextContent('/Settings');
    expect(ref.current).toHaveAttribute('href', '/settings');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Example />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
