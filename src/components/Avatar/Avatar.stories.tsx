import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Avatar } from '.';

const photo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#c7d2fe"/><circle cx="32" cy="26" r="12" fill="#4338ca"/><path d="M10 64c2-14 12-20 22-20s20 6 22 20z" fill="#4338ca"/></svg>',
  );

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  args: { name: 'Ada Lovelace' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const WithImage: Story = {
  args: { src: photo },
};

export const BrokenImage: Story = {
  args: { src: '/does-not-exist.png' },
};

export const Sizes: Story = {
  render: (args) => (
    <div className={styles.row}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Shapes: Story = {
  render: (args) => (
    <div className={styles.row}>
      <Avatar {...args} shape="circle" />
      <Avatar {...args} shape="square" name="Acme Corp" src={photo} />
    </div>
  ),
};
