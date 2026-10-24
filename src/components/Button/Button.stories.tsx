import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArrowUpIcon, ChevronRightIcon } from '../Icon';
import styles from '@/styles/story-layout.module.css';
import { Button, type ButtonVariant } from '.';

const variants: ButtonVariant[] = ['primary', 'secondary', 'outline', 'ghost', 'danger'];

const meta = {
  title: 'Primitives/Button',
  component: Button,
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
