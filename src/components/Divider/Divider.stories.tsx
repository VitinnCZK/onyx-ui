import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Text } from '../Text';
import { Divider } from '.';

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    spacing: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className={styles.stack}>
      <Text>Account settings</Text>
      <Divider {...args} />
      <Text>Notification settings</Text>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className={styles.row}>
      <Text as="span">Docs</Text>
      <Divider {...args} />
      <Text as="span">Blog</Text>
      <Divider {...args} />
      <Text as="span">Changelog</Text>
    </div>
  ),
};

export const Spacing: Story = {
  render: (args) => (
    <div className={styles.stack}>
      {(['none', 'sm', 'md', 'lg'] as const).map((spacing) => (
        <div key={spacing}>
          <Text size="sm" tone="muted">
            spacing=&quot;{spacing}&quot;
          </Text>
          <Divider {...args} spacing={spacing} />
        </div>
      ))}
    </div>
  ),
};
