import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Heading } from '.';

const meta = {
  title: 'Primitives/Heading',
  component: Heading,
  args: { children: 'Design systems scale', level: 2 },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] },
  },
} satisfies Meta<typeof Heading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Levels: Story = {
  render: (args) => (
    <div className={styles.wide}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} {...args} level={level}>
          Heading level {level}
        </Heading>
      ))}
    </div>
  ),
};

export const SizeIndependentOfLevel: Story = {
  args: { level: 3, size: '4xl', children: 'An h3 that looks like a display title' },
};
