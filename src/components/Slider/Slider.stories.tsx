import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import styles from '@/styles/story-layout.module.css';
import { Slider } from '.';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
  args: { 'aria-label': 'Volume', defaultValue: 40, showValue: true, onValueChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Slider key={size} {...args} size={size} aria-label={`Size ${size}`} />
      ))}
    </>
  ),
};

export const FormattedValue: Story = {
  args: {
    'aria-label': 'Price limit',
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: 250,
    formatValue: (value) => `$${value}`,
  },
};

export const States: Story = {
  render: (args) => (
    <>
      <Slider {...args} aria-label="Invalid" invalid defaultValue={90} />
      <Slider {...args} aria-label="Disabled" disabled />
    </>
  ),
};
