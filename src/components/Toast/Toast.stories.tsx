import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { ToastProvider, useToast, type ToastIntent, type ToastPlacement } from '.';

const intents: ToastIntent[] = ['neutral', 'info', 'success', 'warning', 'danger'];

const meta = {
  title: 'Feedback/Toast',
  component: ToastProvider,
  args: { duration: 5000, max: 3, placement: 'bottom-end' },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top-start',
        'top-center',
        'top-end',
        'bottom-start',
        'bottom-center',
        'bottom-end',
      ] satisfies ToastPlacement[],
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Shows the toasts requested with \`useToast\`, one queue per app.

**When to use**

- Brief, non-blocking feedback about something the user just did: "Saved", "Message sent", with an optional undo.

**When not to use**

- Errors or information people must act on: use \`Alert\` or \`Modal\`.
- State that should stay on the page: use \`Alert\`.

**Accessibility**

- New toasts are announced by a live region, and timers pause while the pointer or focus is on them.
- F8 (\`hotkey\`) moves focus to the newest toast so keyboard users can reach its buttons.
- Never make a toast the only way to reach an action; give toasts with actions a longer \`duration\` or \`null\`.`,
      },
    },
  },
  decorators: [
    (Story) => (
      <main className={styles.page}>
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

function IntentButtons() {
  const { toast, dismiss } = useToast();

  return (
    <div className={styles.row}>
      {intents.map((intent) => (
        <Button
          key={intent}
          variant="outline"
          onClick={() =>
            toast({
              intent,
              title: `${intent[0]!.toUpperCase()}${intent.slice(1)} notification`,
              description: 'Press F8 to move focus to the newest notification.',
            })
          }
        >
          {intent}
        </Button>
      ))}
      <Button variant="ghost" onClick={() => dismiss()}>
        Dismiss all
      </Button>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <IntentButtons />
    </ToastProvider>
  ),
};

function ActionButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: 'Message archived',
          action: { label: 'Undo', onClick: () => toast({ title: 'Message restored' }) },
        })
      }
    >
      Archive message
    </Button>
  );
}

export const WithAction: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <ActionButton />
    </ToastProvider>
  ),
};

function QueueButton() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        for (let index = 1; index <= 5; index++) {
          toast({
            title: `File ${index} uploaded`,
            intent: 'success',
            duration: 2000 + index * 500,
          });
        }
      }}
    >
      Upload 5 files
    </Button>
  );
}

export const Queue: Story = {
  args: { max: 2 },
  render: (args) => (
    <ToastProvider {...args}>
      <QueueButton />
    </ToastProvider>
  ),
};

function PersistentButton() {
  const { toast } = useToast();

  return (
    <Button
      variant="danger"
      onClick={() =>
        toast({
          intent: 'danger',
          title: 'Connection lost',
          description: 'We will keep trying to reconnect.',
          duration: null,
        })
      }
    >
      Show persistent error
    </Button>
  );
}

export const Persistent: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      <PersistentButton />
    </ToastProvider>
  ),
};
