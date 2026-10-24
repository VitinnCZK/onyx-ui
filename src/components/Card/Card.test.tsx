import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Card, CardBody, CardFooter, CardHeader } from '.';

describe('Card', () => {
  it('renders an outlined div with medium padding by default', () => {
    render(<Card data-testid="card">Content</Card>);

    expect(screen.getByTestId('card').tagName).toBe('DIV');
    expect(screen.getByTestId('card')).toHaveClass('card', 'outline', 'md');
  });

  it('renders the element passed in as, with variant and padding', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Card as="article" ref={ref} variant="elevated" padding="lg" aria-label="Plan">
        Content
      </Card>,
    );

    expect(screen.getByRole('article', { name: 'Plan' })).toBe(ref.current);
    expect(ref.current).toHaveClass('elevated', 'lg');
  });

  it('lays out a header, body and footer', () => {
    const headerRef = createRef<HTMLDivElement>();
    render(
      <Card>
        <CardHeader ref={headerRef}>
          <h3>Title</h3>
        </CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(headerRef.current).toHaveClass('header');
    expect(screen.getByText('Body')).toHaveClass('body');
    expect(screen.getByText('Footer')).toHaveClass('footer');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Card as="section" aria-labelledby="title">
        <CardHeader>
          <h2 id="title">Usage</h2>
        </CardHeader>
        <CardBody>
          <p>12 of 20 seats used.</p>
        </CardBody>
        <CardFooter>
          <button type="button">Manage</button>
        </CardFooter>
      </Card>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
