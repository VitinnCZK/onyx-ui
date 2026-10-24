import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Skeleton } from '.';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component: `Placeholder shaped like content that is still loading.

**When to use**

- The first load of a page or section, to keep the layout stable.

**When not to use**

- Actions in progress, such as saving: use \`Spinner\` or \`Button\` \`loading\`.
- Long tasks with known progress: use \`Progress\`.

**Accessibility**

- Hidden from assistive technology: mark the loading region with \`aria-busy\` and announce the outcome elsewhere.
- The shimmer stops under \`prefers-reduced-motion\`.`,
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: { lines: 3 },
};

export const Rect: Story = {
  args: { variant: 'rect' },
};

export const Circle: Story = {
  args: { variant: 'circle' },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className={styles.stack} aria-busy="true" aria-label="Loading article" role="group">
      <Skeleton variant="rect" height={160} />
      <div className={styles.row}>
        <Skeleton variant="circle" />
        <Skeleton width="40%" />
      </div>
      <Skeleton lines={3} />
    </div>
  ),
};
