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
