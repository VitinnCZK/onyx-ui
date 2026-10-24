import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Text, type TextTone } from '.';

const tones: TextTone[] = ['default', 'muted', 'primary', 'success', 'warning', 'danger', 'info'];
const sample = 'The quick brown fox jumps over the lazy dog.';

const meta = {
  title: 'Primitives/Text',
  component: Text,
  args: { children: sample },
  argTypes: {
    size: { control: 'inline-radio', options: ['inherit', 'xs', 'sm', 'md', 'lg', 'xl'] },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'semibold', 'bold'] },
    tone: { control: 'select', options: [...tones, 'inherit'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className={styles.wide}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Text key={size} {...args} size={size}>
          {size}: {sample}
        </Text>
      ))}
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className={styles.wide}>
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
        <Text key={weight} {...args} weight={weight}>
          {weight}: {sample}
        </Text>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className={styles.wide}>
      {tones.map((tone) => (
        <Text key={tone} {...args} tone={tone}>
          {tone}: {sample}
        </Text>
      ))}
    </div>
  ),
};

export const Truncate: Story = {
  render: (args) => (
    <div className={styles.stack}>
      <Text {...args} truncate>
        {sample} {sample} {sample}
      </Text>
      <Text {...args} truncate={2}>
        {sample} {sample} {sample} {sample} {sample} {sample} {sample}
      </Text>
    </div>
  ),
};

export const Inline: Story = {
  render: (args) => (
    <Text {...args}>
      Total:{' '}
      <Text as="strong" size="inherit" weight="bold" tone="success">
        $42.00
      </Text>
    </Text>
  ),
};
