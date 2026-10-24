import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { InfoIcon } from '../Icon';
import { IconButton } from '../IconButton';
import { Tooltip, type TooltipPlacement } from '.';

const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  args: {
    content: 'Copy the link to your clipboard',
    children: <Button variant="outline">Copy link</Button>,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left', 'top-start', 'top-end', 'bottom-start'],
    },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className={styles.centered}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
};

export const OnIconButton: Story = {
  args: {
    content: 'Account details',
    children: (
      <IconButton label="Info" variant="outline">
        <InfoIcon />
      </IconButton>
    ),
  },
};

export const Placements: Story = {
  render: (args) => (
    <div className={styles.row}>
      {(['top', 'right', 'bottom', 'left'] as TooltipPlacement[]).map((placement) => (
        <Tooltip key={placement} {...args} placement={placement} content={`Placed ${placement}`}>
          <Button variant="outline">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, content: 'Never shown' },
};
