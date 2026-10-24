import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '../Text';
import { Tab, TabList, TabPanel, Tabs } from '.';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
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
