import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Input } from '../Input';
import { Label } from '.';

const meta = {
  title: 'Forms/Label',
  component: Label,
  parameters: {
    docs: {
      description: {
        component: `Caption of a form control.

**When to use**

- Custom layouts where \`FormField\` does not fit.

**When not to use**

- Inside \`FormField\`, which already renders one.
- \`Checkbox\`, \`Switch\` and \`Radio\`: pass the label as \`children\`.
- A group of controls: use a \`fieldset\` with a \`legend\`.

**Accessibility**

- Associate it with \`htmlFor\` or by wrapping the control, so clicking it focuses the control.
- The \`required\` marker is visual only: set \`required\` on the control too.`,
      },
    },
  },
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
