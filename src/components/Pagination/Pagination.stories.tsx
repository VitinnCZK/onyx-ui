import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from '@/styles/story-layout.module.css';
import { Text } from '../Text';
import { Pagination } from '.';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
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
