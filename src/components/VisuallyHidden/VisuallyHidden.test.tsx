import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { VisuallyHidden } from '.';

describe('VisuallyHidden', () => {
  it('renders a span that keeps its text in the accessibility tree', () => {
    render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Close dialog</VisuallyHidden>
      </button>,
    );

    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    expect(screen.getByText('Close dialog').tagName).toBe('SPAN');
    expect(screen.getByText('Close dialog')).toHaveClass('visuallyHidden');
  });

  it('renders the element passed in as', () => {
    render(
      <>
        <VisuallyHidden as="label" htmlFor="search">
          Search
        </VisuallyHidden>
        <input id="search" type="search" />
      </>,
    );

    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('merges className and passes other props through', () => {
    render(
      <VisuallyHidden className="custom" id="hint">
        Hint
      </VisuallyHidden>,
    );

    const hint = screen.getByText('Hint');
    expect(hint).toHaveClass('visuallyHidden', 'custom');
    expect(hint).toHaveAttribute('id', 'hint');
  });

  it('forwards the ref to the rendered element', () => {
    const spanRef = createRef<HTMLSpanElement>();
    const divRef = createRef<HTMLDivElement>();
    render(
      <>
        <VisuallyHidden ref={spanRef}>Span</VisuallyHidden>
        <VisuallyHidden as="div" ref={divRef}>
          Div
        </VisuallyHidden>
      </>,
    );

    expect(spanRef.current).toBeInstanceOf(HTMLSpanElement);
    expect(divRef.current).toBeInstanceOf(HTMLDivElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <button type="button">
        <svg aria-hidden="true" />
        <VisuallyHidden>Settings</VisuallyHidden>
      </button>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
