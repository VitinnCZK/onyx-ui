import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Card } from '../Card';
import { InfoIcon } from '../Icon';
import { EmptyState } from '.';

const meta = {
  title: 'Data display/EmptyState',
  component: EmptyState,
  args: {
    icon: <InfoIcon />,
    title: 'No projects yet',
    description: 'Projects keep your files, members and settings in one place.',
    action: <Button>Create project</Button>,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: false },
    action: { control: false },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { size: 'sm' },
};

export const NoResults: Story = {
  args: {
    title: 'No results for “invoice 2024”',
    description: 'Check the spelling or try fewer words.',
    action: (
      <>
        <Button variant="outline">Clear search</Button>
        <Button variant="ghost">Browse all files</Button>
      </>
    ),
  },
};

export const InsideCard: Story = {
  render: (args) => (
    <Card>
      <EmptyState {...args} size="sm" />
    </Card>
  ),
};
