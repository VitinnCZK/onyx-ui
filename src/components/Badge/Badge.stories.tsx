import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { SuccessIcon } from '../Icon';
import { Badge, type BadgeIntent, type BadgeVariant } from '.';

const intents: BadgeIntent[] = ['neutral', 'primary', 'success', 'warning', 'danger', 'info'];
const variants: BadgeVariant[] = ['subtle', 'solid', 'outline'];

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'Badge' },
  argTypes: {
    intent: { control: 'select', options: intents },
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IntentsAndVariants: Story = {
  render: (args) => (
    <div className={styles.wide}>
      {variants.map((variant) => (
        <div key={variant} className={styles.row}>
          {intents.map((intent) => (
            <Badge key={intent} {...args} intent={intent} variant={variant}>
              {intent}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className={styles.row}>
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { intent: 'success', icon: <SuccessIcon />, children: 'Verified' },
};
