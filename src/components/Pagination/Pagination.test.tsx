import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { getPaginationItems, Pagination } from '.';

const labels = () =>
  [...screen.getByRole('list').querySelectorAll('li')].map((item) => item.textContent);

describe('getPaginationItems', () => {
  it('lists every page when they fit', () => {
    expect(getPaginationItems(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationItems(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('adds ellipses around the current page', () => {
    expect(getPaginationItems(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
    expect(getPaginationItems(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
    expect(getPaginationItems(20, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
  });

  it('keeps the same number of items on every page', () => {
    const lengths = Array.from(
      { length: 30 },
      (_, index) => getPaginationItems(index + 1, 30).length,
    );

    expect(new Set(lengths)).toEqual(new Set([7]));
  });

  it('respects the sibling and boundary counts', () => {
    expect(getPaginationItems(10, 20, 2, 2)).toEqual([
      1,
      2,
      'ellipsis',
      8,
      9,
      10,
      11,
      12,
      'ellipsis',
      19,
      20,
    ]);
  });
});

describe('Pagination', () => {
  it('renders a labelled navigation with the current page marked', () => {
    render(<Pagination totalPages={10} defaultPage={5} />);

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    expect(labels()).toEqual(['', '1', '…', '4', '5', '6', '…', '10', '']);
  });

  it('changes page with the page, previous and next buttons', async () => {
    const onPageChange = vi.fn();
    render(<Pagination totalPages={10} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(4);

    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('keeps the step buttons focusable but inactive at the ends', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination totalPages={3} defaultPage={2} onPageChange={onPageChange} />);
    const next = screen.getByRole('button', { name: 'Next page' });

    await user.click(next);
    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(next).toHaveFocus();

    await user.click(next);
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toHaveAttribute(
      'aria-disabled',
    );
  });

  it('hides the ellipses from assistive technology', () => {
    render(<Pagination totalPages={20} defaultPage={10} />);

    for (const ellipsis of screen.getAllByText('…')) {
      expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('works as a controlled component with custom labels', async () => {
    const onPageChange = vi.fn();
    const ref = createRef<HTMLElement>();
    render(
      <Pagination
        ref={ref}
        totalPages={5}
        page={2}
        onPageChange={onPageChange}
        aria-label="Results pages"
        previousLabel="Anterior"
        nextLabel="Próxima"
        getPageLabel={(page) => `Página ${page}`}
        size="sm"
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Próxima' }));

    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(ref.current).toBe(screen.getByRole('navigation', { name: 'Results pages' }));
    expect(ref.current).toHaveClass('pagination', 'sm');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination totalPages={20} defaultPage={10} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
