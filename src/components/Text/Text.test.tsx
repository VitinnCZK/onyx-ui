import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Text } from '.';

describe('Text', () => {
  it('renders a paragraph with the default size and tone', () => {
    render(<Text>Hello</Text>);
    const text = screen.getByText('Hello');

    expect(text.tagName).toBe('P');
    expect(text).toHaveClass('text', 'sizeMd', 'toneDefault');
  });

  it('applies size, weight, tone and alignment', () => {
    render(
      <Text size="sm" weight="semibold" tone="danger" align="center">
        Error
      </Text>,
    );

    expect(screen.getByText('Error')).toHaveClass('sizeSm', 'semibold', 'toneDanger', 'center');
  });

  it('truncates to one line or clamps to a number of lines', () => {
    render(
      <>
        <Text truncate>One line</Text>
        <Text truncate={3} style={{ color: 'red' }}>
          Three lines
        </Text>
      </>,
    );

    expect(screen.getByText('One line')).toHaveClass('truncate');
    const clamped = screen.getByText('Three lines');
    expect(clamped).toHaveClass('clamp');
    expect(clamped.style.getPropertyValue('--text-lines')).toBe('3');
    expect(clamped.style.color).toBe('red');
  });

  it('renders the element passed in as and forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Text as="span" ref={ref} tone="muted">
        Inline
      </Text>,
    );

    expect(ref.current?.tagName).toBe('SPAN');
    expect(ref.current).toHaveClass('toneMuted');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Text tone="muted">Some helpful text.</Text>);

    expect(await axe(container)).toHaveNoViolations();
  });
});
