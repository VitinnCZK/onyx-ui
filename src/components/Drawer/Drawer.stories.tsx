import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Drawer, type DrawerPlacement } from '.';

const meta = {
  title: 'Overlays/Drawer',
  component: Drawer,
  parameters: {
    docs: {
      description: {
        component: `Dialog attached to an edge of the screen.

**When to use**

- Secondary tasks that keep the page in context: filters, navigation on small screens, details of a list item.

**When not to use**

- A short confirmation or a blocking decision: use \`Modal\`.
- A few options next to a control: use \`Popover\` or \`DropdownMenu\`.

**Accessibility**

- \`title\` names the dialog and \`description\` describes it.
- Focus moves inside and is trapped, the page stops scrolling, Escape or the close button closes it, and focus returns to the trigger.`,
      },
    },
  },
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
  // Left out of the docs page, where the open overlay would take over the page.
  tags: ['!autodocs'],
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
