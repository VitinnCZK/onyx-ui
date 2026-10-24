import { render, screen } from '@testing-library/react';
import { createRef, forwardRef } from 'react';
import { describe, expect, it } from 'vitest';
import type { PolymorphicComponent, PolymorphicProps } from './polymorphic';

interface BoxProps {
  tone?: 'neutral' | 'accent';
}

const Box = forwardRef<HTMLDivElement, PolymorphicProps<'div', BoxProps>>(function Box(
  { as: Component = 'div', tone = 'neutral', ...props },
  ref,
) {
  return <Component ref={ref} data-tone={tone} {...props} />;
}) as PolymorphicComponent<'div', BoxProps>;

describe('polymorphic components', () => {
  it('render the default element', () => {
    render(<Box>Content</Box>);

    expect(screen.getByText('Content').tagName).toBe('DIV');
  });

  it('render the element passed in as, with its own props', () => {
    render(
      <Box as="a" href="/docs" tone="accent">
        Docs
      </Box>,
    );

    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveAttribute('data-tone', 'accent');
  });

  it('forward a ref typed for the rendered element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Box as="button" type="button" ref={ref}>
        Save
      </Box>,
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('type props and refs by the rendered element', () => {
    const invalid = [
      // @ts-expect-error `href` is not a div prop
      <Box key="href" href="/" />,
      // @ts-expect-error the ref must match the element in `as`
      <Box key="ref" as="a" ref={createRef<HTMLDivElement>()} />,
      // @ts-expect-error own props keep their types
      <Box key="tone" tone="loud" />,
    ];

    expect(invalid).toHaveLength(3);
  });
});
