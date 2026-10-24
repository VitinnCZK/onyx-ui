import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import styles from '@/styles/story-layout.module.css';
import { Switch } from '.';

const meta = {
  title: 'Forms/Switch',
  component: Switch,
  args: { children: 'Email notifications', onCheckedChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: { description: 'Get an email when someone mentions you.', defaultChecked: true },
};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Switch key={size} {...args} size={size} defaultChecked>
          Size {size}
        </Switch>
      ))}
    </>
  ),
};

export const States: Story = {
  render: (args) => (
    <>
      <Switch {...args}>Off</Switch>
      <Switch {...args} defaultChecked>
        On
      </Switch>
      <Switch {...args} disabled>
        Disabled off
      </Switch>
      <Switch {...args} disabled defaultChecked>
        Disabled on
      </Switch>
    </>
  ),
};
