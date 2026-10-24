import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { Alert, type AlertIntent } from '.';

const intents: AlertIntent[] = ['info', 'success', 'warning', 'danger'];

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component: `Highlighted message about the page or a task.

**When to use**

- Messages tied to a page or section that stay visible: an error summary, a maintenance notice, a warning before an action.

**When not to use**

- Short confirmation of something the user just did: use \`Toast\`.
- A decision the user must make before going on: use \`Modal\` with \`role="alertdialog"\`.
- An error on a single field: use the \`error\` of \`FormField\`.

**Accessibility**

- \`warning\` and \`danger\` use \`role="alert"\` and are announced right away; \`info\` and \`success\` use \`role="status"\`.
- Live regions announce changes, so render the alert when the event happens instead of toggling its text.
- The icon and the title carry the intent too, so it never depends on color alone.`,
      },
    },
  },
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
