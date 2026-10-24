import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Select } from '.';

const fruits = (
  <>
    <option value="apple">Apple</option>
    <option value="banana">Banana</option>
    <option value="cherry">Cherry</option>
    <option value="durian" disabled>
      Durian (out of season)
    </option>
  </>
);

const meta = {
  title: 'Forms/Select',
  component: Select,
  args: { 'aria-label': 'Fruit', placeholder: 'Pick a fruit', children: fruits },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Select key={size} {...args} size={size} aria-label={`Size ${size}`} />
      ))}
    </>
  ),
};

export const States: Story = {
  render: (args) => (
    <>
      <Select {...args} aria-label="Selected" defaultValue="banana" />
      <Select {...args} aria-label="Invalid" invalid />
      <Select {...args} aria-label="Disabled" disabled />
    </>
  ),
};

export const Groups: Story = {
  args: {
    placeholder: undefined,
    children: (
      <>
        <optgroup label="Fruits">
          <option>Apple</option>
          <option>Banana</option>
        </optgroup>
        <optgroup label="Vegetables">
          <option>Carrot</option>
          <option>Leek</option>
        </optgroup>
      </>
    ),
  },
};

export const Multiple: Story = {
  args: { multiple: true, placeholder: undefined, 'aria-label': 'Fruits' },
};
