import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { Alert, type AlertIntent } from '.';

const intents: AlertIntent[] = ['info', 'success', 'warning', 'danger'];

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  args: {
    title: 'Scheduled maintenance',
    children: 'The dashboard will be read-only on Sunday from 2 to 4 AM UTC.',
  },
  argTypes: {
    intent: { control: 'inline-radio', options: intents },
    variant: { control: 'inline-radio', options: ['subtle', 'solid'] },
  },
  decorators: [
    (Story) => (
      <div className={styles.wide}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Intents: Story = {
  render: (args) => (
    <>
      {intents.map((intent) => (
        <Alert key={intent} {...args} intent={intent} title={`${intent} alert`} />
      ))}
    </>
  ),
};

export const Solid: Story = {
  render: (args) => (
    <>
      {intents.map((intent) => (
        <Alert key={intent} {...args} intent={intent} variant="solid" title={`${intent} alert`} />
      ))}
    </>
  ),
};

export const WithoutTitle: Story = {
  args: { title: undefined, intent: 'success', children: 'Your profile was updated.' },
};

export const Dismissible: Story = {
  args: { onDismiss: fn() },
};

export const WithAction: Story = {
  args: {
    intent: 'warning',
    title: 'Your trial ends in 3 days',
    children: 'Add a payment method to keep your projects running.',
    action: (
      <>
        <Button size="sm">Add payment method</Button>
        <Button size="sm" variant="ghost">
          Remind me later
        </Button>
      </>
    ),
    onDismiss: fn(),
  },
};
