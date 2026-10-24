import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Table, type TableColumn, type TableProps } from '.';

interface Person {
  id: number;
  name: string;
  role: string;
  age: number | null;
}

const people: Person[] = [
  { id: 1, name: 'Grace', role: 'Admiral', age: 85 },
  { id: 2, name: 'ada', role: 'Countess', age: 36 },
  { id: 3, name: 'Alan', role: 'Mathematician', age: null },
  { id: 4, name: 'Linus', role: 'Engineer', age: 54 },
];

const columns: TableColumn<Person>[] = [
  { key: 'name', header: 'Name', sortable: true, rowHeader: true },
  { key: 'role', header: 'Role' },
  { key: 'age', header: 'Age', sortable: true, align: 'end', cell: (row) => row.age ?? '—' },
];

function Example(props: Partial<TableProps<Person>>) {
  return (
    <Table
      caption="Pioneers"
      columns={columns}
      data={people}
      getRowKey={(row) => row.id}
      {...props}
    />
  );
}

const names = () =>
  within(screen.getByRole('table'))
    .getAllByRole('rowheader')
    .map((cell) => cell.textContent);

describe('Table', () => {
  it('renders a captioned table inside a named region', () => {
    render(<Example />);
    const table = screen.getByRole('table', { name: 'Pioneers' });

    expect(screen.getByRole('region', { name: 'Pioneers' })).toContainElement(table);
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent),
    ).toEqual(['Name', 'Role', 'Age']);
    expect(within(table).getAllByRole('row')).toHaveLength(people.length + 1);
  });

  it('renders cells from the row or the cell function, with row headers', () => {
    render(<Example />);

    expect(names()).toEqual(['Grace', 'ada', 'Alan', 'Linus']);
    expect(screen.getByRole('rowheader', { name: 'Grace' })).toHaveAttribute('scope', 'row');
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('sorts ascending, then descending, marking the column with aria-sort', async () => {
    const onSortChange = vi.fn();
    render(<Example onSortChange={onSortChange} />);
    const header = screen.getByRole('columnheader', { name: 'Name' });

    expect(header).not.toHaveAttribute('aria-sort');

    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(header).toHaveAttribute('aria-sort', 'ascending');
    expect(names()).toEqual(['ada', 'Alan', 'Grace', 'Linus']);
    expect(onSortChange).toHaveBeenLastCalledWith({ key: 'name', direction: 'ascending' });

    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(header).toHaveAttribute('aria-sort', 'descending');
    expect(names()).toEqual(['Linus', 'Grace', 'Alan', 'ada']);
  });

  it('sorts numbers and keeps empty values last', async () => {
    render(<Example />);

    await userEvent.click(screen.getByRole('button', { name: 'Age' }));
    expect(names()).toEqual(['ada', 'Linus', 'Grace', 'Alan']);
    expect(screen.getByRole('columnheader', { name: 'Name' })).not.toHaveAttribute('aria-sort');

    await userEvent.click(screen.getByRole('button', { name: 'Age' }));
    expect(names()).toEqual(['Alan', 'Grace', 'Linus', 'ada']);
  });

  it('only renders sort buttons for sortable columns', () => {
    render(<Example />);

    expect(screen.queryByRole('button', { name: 'Role' })).not.toBeInTheDocument();
  });

  it('keeps the data order with manual or controlled sorting', async () => {
    const onSortChange = vi.fn();
    render(
      <Example
        manualSorting
        sort={{ key: 'name', direction: 'descending' }}
        onSortChange={onSortChange}
      />,
    );

    expect(names()).toEqual(['Grace', 'ada', 'Alan', 'Linus']);
    await userEvent.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith({ key: 'name', direction: 'ascending' });
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
  });

  it('shows the empty state when there are no rows', () => {
    const { rerender } = render(<Example data={[]} />);
    const cell = screen.getByRole('cell');

    expect(cell).toHaveTextContent('No data to show.');
    expect(cell).toHaveAttribute('colspan', '3');

    rerender(<Example data={[]} emptyState="Nobody here yet." />);
    expect(screen.getByRole('cell')).toHaveTextContent('Nobody here yet.');
  });

  it('shows a spinner and marks the table busy while loading', () => {
    render(<Example data={[]} loading />);

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Loading rows');
  });

  it('hides the caption visually, applies the options and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Table
        ref={ref}
        caption="Pioneers"
        hideCaption
        density="compact"
        striped
        stickyHeader
        columns={columns}
        data={people}
        getRowKey={(row) => row.id}
      />,
    );

    expect(screen.getByText('Pioneers')).toHaveClass('hidden');
    expect(screen.getByRole('table')).toHaveClass('compact', 'striped', 'sticky');
    expect(ref.current).toBe(screen.getByRole('region'));
  });

  it('is not a region without a name', () => {
    render(<Example caption={undefined} aria-label={undefined} />);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Example />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
