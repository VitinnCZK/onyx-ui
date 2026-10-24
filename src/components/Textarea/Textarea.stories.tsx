import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Textarea } from '.';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component: `Multi-line text field.

**When to use**

- Longer free text: comments, descriptions, messages.

**When not to use**

- A single line: use \`Input\`.
- Formatted text: use a rich text editor.

**Accessibility**

- Label it with \`FormField\` or \`aria-label\`.
- State length limits in the helper text, not only in \`maxLength\`.`,
      },
    },
  },
  args: { 'aria-label': 'Message', placeholder: 'Write a message…' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    resize: { control: 'inline-radio', options: ['none', 'vertical', 'both'] },
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Textarea key={size} {...args} size={size} aria-label={`Size ${size}`} rows={2} />
      ))}
    </>
  ),
};

export const States: Story = {
  render: (args) => (
    <>
      <Textarea {...args} aria-label="Invalid" invalid defaultValue="Too short" />
      <Textarea {...args} aria-label="Disabled" disabled />
      <Textarea {...args} aria-label="Read only" readOnly defaultValue="This cannot be edited." />
    </>
  ),
};

export const AutoResize: Story = {
  args: {
    autoResize: true,
    resize: 'none',
    rows: 2,
    defaultValue: 'Type more lines and the field grows with them.',
  },
};
