import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from '@/styles/story-layout.module.css';
import { Text } from '../Text';
import { Pagination } from '.';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `Moves between the pages of a long list.

**When to use**

- Long lists or tables split into pages, where people may jump to a specific page.

**When not to use**

- Feeds browsed continuously: use a "Load more" \`Button\`.
- Short lists: show every item.

**Accessibility**

- Renders a \`nav\` named "Pagination"; the current page has \`aria-current="page"\`.
- \`previousLabel\`, \`nextLabel\` and \`getPageLabel\` name the buttons; translate them with the rest of the UI.
- After a page change, move focus to the start of the new content or announce it.`,
      },
    },
  },
  args: { totalPages: 20, defaultPage: 1 },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
    boundaryCount: { control: { type: 'number', min: 0, max: 3 } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MiddlePage: Story = {
  args: { defaultPage: 10 },
};

export const FewPages: Story = {
  args: { totalPages: 5, defaultPage: 3 },
};

export const Small: Story = {
  args: { size: 'sm', defaultPage: 10 },
};

export const MoreSiblings: Story = {
  args: { defaultPage: 10, siblingCount: 2, boundaryCount: 2 },
};

function ControlledDemo() {
  const [page, setPage] = useState(4);

  return (
    <div className={styles.wide}>
      <Text tone="muted" size="sm" aria-live="polite">
        Showing results {(page - 1) * 10 + 1}–{page * 10} of 120
      </Text>
      <Pagination totalPages={12} page={page} onPageChange={setPage} />
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
