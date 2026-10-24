import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { ChevronDownIcon, CloseIcon, ExternalLinkIcon, MoreHorizontalIcon } from '../Icon';
import { IconButton } from '../IconButton';
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '.';

const onSelect = fn();

const meta = {
  title: 'Overlays/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: `Menu of actions opened by a button.

**When to use**

- Actions related to an element, such as row actions or a "More" menu.

**When not to use**

- Choosing a value in a form: use \`Select\` or \`RadioGroup\`.
- Moving between pages: use links.
- Forms or rich content: use \`Popover\`.

**Accessibility**

- Follows the ARIA menu button pattern: arrow keys, Home/End and typing a label move between items, Enter or Space runs one, Escape closes and returns focus to the button.
- The trigger needs an accessible name; with \`IconButton\`, use its \`label\`.
- Keep item labels short and with distinct first letters, so typing finds them.`,
      },
    },
  },
  args: {
    trigger: (
      <Button variant="outline" endIcon={<ChevronDownIcon />}>
        Options
      </Button>
    ),
    children: (
      <>
        <DropdownMenuItem shortcut="Ctrl+E" onSelect={() => onSelect('edit')}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem shortcut="Ctrl+D" onSelect={() => onSelect('duplicate')}>
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem disabled>Move to folder</DropdownMenuItem>
        <DropdownMenuItem icon={<ExternalLinkIcon />} onSelect={() => onSelect('open')}>
          Open in new tab
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup label="Danger zone">
          <DropdownMenuItem destructive icon={<CloseIcon />} onSelect={() => onSelect('delete')}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </>
    ),
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'right-start'],
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
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  // Left out of the docs page, where the open overlay would take over the page.
  tags: ['!autodocs'],
  args: { defaultOpen: true },
};

export const IconTrigger: Story = {
  args: {
    placement: 'bottom-end',
    trigger: (
      <IconButton label="More actions" variant="outline">
        <MoreHorizontalIcon />
      </IconButton>
    ),
  },
};
