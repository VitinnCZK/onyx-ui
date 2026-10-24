import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Drawer, type DrawerPlacement } from '.';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  args: {
    title: 'Filters',
    description: 'Narrow down the results.',
    trigger: <Button variant="outline">Show filters</Button>,
    children: (
      <>
        <Checkbox defaultChecked>In stock</Checkbox>
        <Checkbox>On sale</Checkbox>
        <Checkbox>Free shipping</Checkbox>
      </>
    ),
    footer: (
      <>
        <Button variant="ghost">Reset</Button>
        <Button>Apply</Button>
      </>
    ),
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['start', 'end', 'top', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] },
    trigger: { control: false },
    children: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
};

export const Placements: Story = {
  render: (args) => (
    <div className={styles.row}>
      {(['start', 'end', 'top', 'bottom'] as DrawerPlacement[]).map((placement) => (
        <Drawer
          key={placement}
          {...args}
          placement={placement}
          trigger={<Button variant="outline">From {placement}</Button>}
        />
      ))}
    </div>
  ),
};

export const Large: Story = {
  args: { size: 'lg', trigger: <Button variant="outline">Open large drawer</Button> },
};
