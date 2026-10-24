import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import styles from '@/styles/story-layout.module.css';
import type { ButtonVariant } from '../Button';
import { CloseIcon, MoreHorizontalIcon } from '../Icon';
import { IconButton } from '.';

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  parameters: {
    docs: {
      description: {
        component: `Square button that shows only an icon.

**When to use**

- Compact actions with a well-known icon: close, more options, toolbar actions.

**When not to use**

- Actions whose icon is not obvious: use \`Button\` with text, optionally with \`startIcon\`.

**Accessibility**

- \`label\` is required and becomes the accessible name; the icon is hidden.
- Wrap it in a \`Tooltip\` with the same text so sighted users can read the label too.`,
      },
    },
  },
  args: { label: 'More options', children: <MoreHorizontalIcon />, onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className={styles.row}>
      {variants.map((variant) => (
        <IconButton key={variant} {...args} variant={variant} label={`Close (${variant})`}>
          <CloseIcon />
        </IconButton>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className={styles.row}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <IconButton key={size} {...args} variant="outline" size={size} label={`Close (${size})`}>
          <CloseIcon />
        </IconButton>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className={styles.row}>
      <IconButton {...args} variant="outline" label="Disabled" disabled />
      <IconButton {...args} variant="outline" label="Loading" loading />
    </div>
  ),
};
