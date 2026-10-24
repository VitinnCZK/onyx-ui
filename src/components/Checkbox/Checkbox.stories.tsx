import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from '@/styles/story-layout.module.css';
import { Checkbox } from '.';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  args: { children: 'Remember me' },
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
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    children: 'Product updates',
    description: 'A short email when we ship something new. No more than once a month.',
  },
};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Checkbox key={size} {...args} size={size} defaultChecked>
          Size {size}
        </Checkbox>
      ))}
    </>
  ),
};

export const States: Story = {
  render: (args) => (
    <>
      <Checkbox {...args}>Unchecked</Checkbox>
      <Checkbox {...args} defaultChecked>
        Checked
      </Checkbox>
      <Checkbox {...args} indeterminate>
        Indeterminate
      </Checkbox>
      <Checkbox {...args} invalid>
        Invalid
      </Checkbox>
      <Checkbox {...args} disabled>
        Disabled
      </Checkbox>
      <Checkbox {...args} disabled defaultChecked>
        Disabled and checked
      </Checkbox>
    </>
  ),
};

function SelectAllDemo() {
  const items = ['Email', 'SMS', 'Push'];
  const [selected, setSelected] = useState<string[]>(['Email']);
  const all = selected.length === items.length;

  return (
    <>
      <Checkbox
        checked={all}
        indeterminate={selected.length > 0 && !all}
        onCheckedChange={(checked) => setSelected(checked ? items : [])}
      >
        All channels
      </Checkbox>
      {items.map((item) => (
        <Checkbox
          key={item}
          checked={selected.includes(item)}
          onCheckedChange={(checked) =>
            setSelected((current) =>
              checked ? [...current, item] : current.filter((value) => value !== item),
            )
          }
        >
          {item}
        </Checkbox>
      ))}
    </>
  );
}

export const SelectAll: Story = {
  render: () => <SelectAllDemo />,
};
