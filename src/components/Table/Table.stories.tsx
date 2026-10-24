import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { Table, type TableColumn } from '.';

interface Invoice {
  id: string;
  customer: string;
  status: 'paid' | 'pending' | 'overdue';
  issued: Date;
  amount: number;
}

const invoices: Invoice[] = [
  {
    id: 'INV-1042',
    customer: 'Acme Corp',
    status: 'paid',
    issued: new Date(2026, 8, 3),
    amount: 1250,
  },
  {
    id: 'INV-1043',
    customer: 'Globex',
    status: 'pending',
    issued: new Date(2026, 8, 12),
    amount: 980.5,
  },
  {
    id: 'INV-1044',
    customer: 'Initech',
    status: 'overdue',
    issued: new Date(2026, 7, 28),
    amount: 4300,
  },
  {
    id: 'INV-1045',
    customer: 'Umbrella',
    status: 'paid',
    issued: new Date(2026, 9, 1),
    amount: 120,
  },
  {
    id: 'INV-1046',
    customer: 'Hooli',
    status: 'pending',
    issued: new Date(2026, 9, 9),
    amount: 15750,
  },
  {
    id: 'INV-1047',
    customer: 'Stark Industries',
    status: 'paid',
    issued: new Date(2026, 9, 15),
    amount: 2200,
  },
];

const intents = { paid: 'success', pending: 'warning', overdue: 'danger' } as const;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const date = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' });

const columns: TableColumn<Invoice>[] = [
  { key: 'id', header: 'Invoice', sortable: true, rowHeader: true },
  { key: 'customer', header: 'Customer', sortable: true },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => <Badge intent={intents[row.status]}>{row.status}</Badge>,
  },
  {
    key: 'issued',
    header: 'Issued',
    sortable: true,
    cell: (row) => date.format(row.issued),
  },
  {
    key: 'amount',
    header: 'Amount',
    sortable: true,
    align: 'end',
    cell: (row) => money.format(row.amount),
  },
];

const meta = {
  title: 'Data display/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: `Data table with sortable columns, an empty state and a scroll region for narrow screens.

**When to use**

- Structured data compared across rows and columns.

**When not to use**

- Page layout.
- Items with only a couple of attributes: use a list or \`Card\`s.

**Accessibility**

- \`caption\` names the table and its scroll region; \`hideCaption\` keeps it for assistive technology only.
- Sortable headers are buttons, and the sorted column has \`aria-sort\`.
- The scroll region becomes focusable when it overflows, so keyboard users can scroll it. \`loading\` sets \`aria-busy\`.`,
      },
    },
  },
  args: {
    caption: 'Recent invoices',
    columns: columns as TableColumn<unknown>[],
    data: invoices,
    getRowKey: (row) => (row as Invoice).id,
  },
  argTypes: {
    density: { control: 'inline-radio', options: ['normal', 'compact'] },
    columns: { control: false },
    data: { control: false },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SortedByAmount: Story = {
  args: { defaultSort: { key: 'amount', direction: 'descending' } },
};

export const CompactAndStriped: Story = {
  args: { density: 'compact', striped: true },
};

export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
    data: [...invoices, ...invoices, ...invoices].map((row, index) => ({
      ...row,
      id: `${row.id}-${index}`,
    })),
    className: styles.scrollBox,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    emptyState: (
      <EmptyState
        size="sm"
        title="No invoices yet"
        description="Invoices you send show up here."
        action={<Button size="sm">Create invoice</Button>}
      />
    ),
  },
};

export const Loading: Story = {
  args: { data: [], loading: true },
};

export const NarrowScreen: Story = {
  decorators: [
    (Story) => (
      <div className={styles.narrow}>
        <Story />
      </div>
    ),
  ],
};
