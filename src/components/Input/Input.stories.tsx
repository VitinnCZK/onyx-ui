import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { CloseIcon, InfoIcon } from '../Icon';
import { IconButton } from '../IconButton';
import { Input } from '.';

const meta = {
  title: 'Forms/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component: `Single-line text field.

**When to use**

- Short free text: names, emails, search terms, numbers.

**When not to use**

- Several lines: use \`Textarea\`.
- Choosing from a known list: use \`Select\` or \`RadioGroup\`.
- An approximate value in a range: use \`Slider\`.

**Accessibility**

- Always label it: wrap it in \`FormField\` or use \`aria-label\`. A placeholder is not a label.
- Use the right \`type\`, \`inputMode\` and \`autoComplete\` so browsers and keyboards help.
- \`invalid\` sets \`aria-invalid\`.`,
      },
    },
  },
  args: { 'aria-label': 'Full name', placeholder: 'Ada Lovelace' },
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
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Input key={size} {...args} size={size} aria-label={`Size ${size}`} />
      ))}
    </>
  ),
};

export const States: Story = {
  render: (args) => (
    <>
      <Input {...args} aria-label="Filled" defaultValue="Ada Lovelace" />
      <Input {...args} aria-label="Invalid" invalid defaultValue="not-an-email" />
      <Input {...args} aria-label="Disabled" disabled />
      <Input {...args} aria-label="Read only" readOnly defaultValue="Read only value" />
    </>
  ),
};

export const WithAdornments: Story = {
  render: (args) => (
    <>
      <Input
        {...args}
        aria-label="Amount"
        placeholder="0.00"
        startAdornment="$"
        endAdornment="USD"
      />
      <Input
        {...args}
        aria-label="Search"
        type="search"
        placeholder="Search"
        startAdornment={<InfoIcon />}
        endAdornment={
          <IconButton label="Clear search" size="sm">
            <CloseIcon />
          </IconButton>
        }
      />
    </>
  ),
};
