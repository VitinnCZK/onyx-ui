import { render, screen } from '@testing-library/react';
import { createRef, forwardRef, type AnchorHTMLAttributes } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Link } from '.';

describe('Link', () => {
  it('renders an anchor with the default variant', () => {
    render(<Link href="/docs">Docs</Link>);

    expect(screen.getByRole('link', { name: 'Docs' })).toHaveClass('link', 'default');
  });

  it('opens external links in a new tab and says so', () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'Example (opens in a new tab)' });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a router link passed in as', () => {
    const RouterLink = forwardRef<
      HTMLAnchorElement,
      AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }
    >(function RouterLink({ to, children, ...props }, ref) {
      return (
        <a ref={ref} href={to} data-router="" {...props}>
          {children}
        </a>
      );
    });
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link as={RouterLink} to="/settings" ref={ref} variant="muted">
        Settings
      </Link>,
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/settings');
    expect(screen.getByRole('link')).toHaveClass('muted');
    expect(ref.current).toHaveAttribute('data-router');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <p>
        Read the <Link href="/docs">docs</Link> or visit{' '}
        <Link href="https://example.com" external>
          the site
        </Link>
        .
      </p>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
