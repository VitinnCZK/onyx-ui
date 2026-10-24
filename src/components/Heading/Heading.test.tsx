import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Heading } from '.';

describe('Heading', () => {
  it('renders an h2 by default', () => {
    render(<Heading>Title</Heading>);

    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toHaveClass(
      'heading',
      'size2xl',
    );
  });

  it('matches the size to the level unless one is given', () => {
    render(
      <>
        <Heading level={1}>Page</Heading>
        <Heading level={4} size="4xl">
          Big
        </Heading>
      </>,
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('size3xl');
    expect(screen.getByRole('heading', { level: 4 })).toHaveClass('size4xl');
  });

  it('forwards the ref and passes props through', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading ref={ref} level={3} id="section" className="custom">
        Section
      </Heading>,
    );

    expect(ref.current?.tagName).toBe('H3');
    expect(ref.current).toHaveAttribute('id', 'section');
    expect(ref.current).toHaveClass('custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Heading level={1}>Page</Heading>
        <Heading>Section</Heading>
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
