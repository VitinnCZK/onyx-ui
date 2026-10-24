import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Switch } from '../Switch';
import { Text } from '../Text';
import { Popover } from '.';

const meta = {
  title: 'Overlays/Popover',
  component: Popover,
  parameters: {
    docs: {
      description: {
        component: `Non-modal dialog anchored to a trigger.

**When to use**

- Interactive content next to a control: small forms, quick settings, details with links.

**When not to use**

- A short description on hover: use \`Tooltip\`.
- A list of actions: use \`DropdownMenu\`.
- Tasks that must block the page: use \`Modal\`.

**Accessibility**

- Named by \`title\` or \`aria-label\`.
- Focus moves inside on open; Escape, a click outside or tabbing out closes it, and Escape returns focus to the trigger.`,
      },
    },
  },
  args: {
    title: 'Notification settings',
    trigger: <Button variant="outline">Notifications</Button>,
    children: (
      <>
        <Switch defaultChecked>Email</Switch>
        <Switch>Push</Switch>
        <Switch>SMS</Switch>
      </>
    ),
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'right', 'left'],
    },
    trigger: { control: false },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className={styles.centered}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  // Left out of the docs page, where the open overlay would take over the page.
  tags: ['!autodocs'],
  args: { defaultOpen: true },
};

export const WithForm: Story = {
  args: {
    title: 'Rename file',
    showClose: true,
    trigger: <Button>Rename</Button>,
    children: (
      <>
        <FormField label="File name">
          <Input defaultValue="report-final.pdf" />
        </FormField>
        <Button size="sm">Save</Button>
      </>
    ),
  },
};

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    'aria-label': 'Help',
    trigger: <Button variant="ghost">What is this?</Button>,
    children: (
      <Text size="sm">
        Workspaces keep projects, members and billing separate. Press Escape to close this.
      </Text>
    ),
  },
};
