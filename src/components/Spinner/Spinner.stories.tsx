import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './Spinner.stories.module.css';
import { Spinner } from '.';

const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'inline-radio', options: ['inherit', 'xs', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className={styles.row}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Spinner key={size} size={size} label={`Loading (${size})`} />
      ))}
    </div>
  ),
};

export const InheritsColor: Story = {
  render: () => (
    <p className={styles.text}>
      <Spinner size="inherit" label="Syncing" /> Syncing your files…
    </p>
  ),
};
