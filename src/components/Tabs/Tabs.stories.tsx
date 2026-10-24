import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text';
import { Tab, TabList, TabPanel, Tabs } from '.';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: `Switches between panels of content, one visible at a time.

**When to use**

- Related views of the same context, at the same level: overview, activity, settings.

**When not to use**

- Steps of a process, or content that should be read in order.
- Moving between pages: use links.
- Content that people need to compare side by side.

**Accessibility**

- Follows the ARIA tabs pattern: arrow keys and Home/End move between tabs, Tab moves into the panel.
- Name the \`TabList\` with \`aria-label\` or \`aria-labelledby\`.
- Use \`activationMode="manual"\` when showing a panel is slow, so Enter or Space has to confirm.`,
      },
    },
  },
  args: { defaultValue: 'overview' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['line', 'solid'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    activationMode: { control: 'inline-radio', options: ['automatic', 'manual'] },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Project">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
        <Tab value="archive" disabled>
          Archive
        </Tab>
      </TabList>
      <TabPanel value="overview">
        <Text>A summary of the project and its latest numbers.</Text>
      </TabPanel>
      <TabPanel value="activity">
        <Text>Everything that happened in the last 30 days.</Text>
      </TabPanel>
      <TabPanel value="settings">
        <Text>Name, visibility and members of the project.</Text>
      </TabPanel>
      <TabPanel value="archive">
        <Text>Archived items.</Text>
      </TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Line: Story = {};

export const Solid: Story = {
  args: { variant: 'solid' },
};

export const Small: Story = {
  args: { size: 'sm' },
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const ManualActivation: Story = {
  args: { activationMode: 'manual' },
};
