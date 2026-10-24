import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Radio, RadioGroup } from '.';

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  args: {
    label: 'Delivery',
    defaultValue: 'standard',
    onValueChange: fn(),
    children: (
      <>
        <Radio value="standard" description="3 to 5 business days">
          Standard
        </Radio>
        <Radio value="express" description="Next business day">
          Express
        </Radio>
        <Radio value="pickup" disabled description="Not available in your area">
          Store pickup
        </Radio>
      </>
    ),
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = {
  args: {
    label: 'Size',
    defaultValue: 'm',
    orientation: 'horizontal',
    children: (
      <>
        <Radio value="s">Small</Radio>
        <Radio value="m">Medium</Radio>
        <Radio value="l">Large</Radio>
      </>
    ),
  },
};

export const WithDescriptionAndError: Story = {
  args: {
    defaultValue: null,
    required: true,
    description: 'Choose how you want to receive the order.',
    error: 'Select a delivery option.',
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <RadioGroup key={size} {...args} label={`Size ${size}`} size={size} />
      ))}
    </>
  ),
};
