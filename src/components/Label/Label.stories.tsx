import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Input } from '../Input';
import { Label } from '.';

const meta = {
  title: 'Forms/Label',
  component: Label,
  args: { children: 'Email address', htmlFor: 'label-story-input' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  render: (args) => (
    <div className={styles.stack}>
      <Label {...args} />
      <Input
        id="label-story-input"
        type="email"
        required={args.required}
        disabled={args.disabled}
      />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Small: Story = {
  args: { size: 'sm' },
};
