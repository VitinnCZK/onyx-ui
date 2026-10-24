import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import styles from '@/styles/story-layout.module.css';
import { Progress, type ProgressIntent } from '.';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  parameters: {
    docs: {
      description: {
        component: `Shows how much of a task is done, or that it is in progress when the amount is unknown.

**When to use**

- Tasks with measurable progress, such as uploads or multi-step processes.

**When not to use**

- A short wait in one spot: use \`Spinner\`.
- Content that is loading: use \`Skeleton\`.

**Accessibility**

- \`role="progressbar"\` with its range and \`aria-valuetext\` (see \`formatValue\`).
- Name it with \`label\` or \`aria-label\`.
- Value changes are not announced: announce the outcome in a live region or with a \`Toast\`.`,
      },
    },
  },
  args: { label: 'Uploading files', value: 45, showValue: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    intent: { control: 'inline-radio', options: ['primary', 'success', 'warning', 'danger'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Indeterminate: Story = {
  args: { value: null, label: 'Loading results', showValue: false },
};

export const Sizes: Story = {
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Progress key={size} {...args} size={size} label={`Size ${size}`} />
      ))}
    </>
  ),
};

export const Intents: Story = {
  render: (args) => (
    <>
      {(['primary', 'success', 'warning', 'danger'] as ProgressIntent[]).map((intent) => (
        <Progress key={intent} {...args} intent={intent} label={intent} />
      ))}
    </>
  ),
};

export const CustomValueText: Story = {
  args: {
    label: 'Checkout',
    value: 2,
    max: 4,
    formatValue: (value, max) => `Step ${value} of ${max}`,
  },
};

function AnimatedDemo() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setValue((current) => (current >= 100 ? 0 : current + 10)),
      600,
    );
    return () => clearInterval(timer);
  }, []);

  return <Progress label="Installing" value={value} showValue />;
}

export const Animated: Story = {
  render: () => <AnimatedDemo />,
};
