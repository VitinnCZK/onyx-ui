import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUpIcon, ChevronRightIcon } from '../Icon';
import styles from '@/styles/story-layout.module.css';
import { Button, type ButtonVariant } from '.';

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `Runs an action: submits a form, opens a dialog, saves a change.

**When to use**

- One \`primary\` button per view for the main action; \`secondary\`, \`outline\` or \`ghost\` for the others.
- \`danger\` for destructive actions, usually confirmed in a \`Modal\`.

**When not to use**

- Going to another page or URL: use \`Link\`.
- Only an icon, no text: use \`IconButton\`.
- A setting that turns on and off: use \`Switch\`.

**Accessibility**

- Renders \`<button type="button">\`; pass \`type="submit"\` inside forms.
- \`loading\` keeps the button focusable with \`aria-disabled\` and adds \`loadingLabel\` to its name.
- Prefer an enabled button that explains what is missing over \`disabled\`, which removes it from the tab order.`,
      },
    },
  },
  args: { children: 'Button', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className={styles.row}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className={styles.row}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <div className={styles.row}>
      <Button {...args} startIcon={<ArrowUpIcon />}>
        Upload
      </Button>
      <Button {...args} variant="outline" endIcon={<ChevronRightIcon />}>
        Continue
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className={styles.row}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} disabled>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <div className={styles.row}>
      {variants.map((variant) => (
        <Button key={variant} {...args} variant={variant} loading>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: 'Create account' },
};
