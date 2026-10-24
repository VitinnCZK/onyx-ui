import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './Icon.stories.module.css';
import * as icons from './icons';
import { Icon } from '.';

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  parameters: {
    docs: {
      description: {
        component: `A 24×24 stroke icon, built in or made from your own shapes.

**When to use**

- Reinforcing a label or a status shown as text.

**When not to use**

- As the only content of a button: use \`IconButton\`, which names it.
- Pictures of people: use \`Avatar\`.

**Accessibility**

- Decorative by default and hidden from assistive technology.
- Pass \`label\` when the icon alone carries meaning; it then needs 3:1 contrast with its background.`,
      },
    },
  },
  args: { size: 'lg' },
  argTypes: {
    size: { control: 'inline-radio', options: ['inherit', 'xs', 'sm', 'md', 'lg', 'xl'] },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <icons.InfoIcon {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div className={styles.row}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <icons.SuccessIcon key={size} size={size} />
      ))}
    </div>
  ),
};

export const InheritsFontSize: Story = {
  render: () => (
    <p className={styles.text}>
      <icons.WarningIcon /> The icon follows the text size and color.
    </p>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Verified' },
  render: (args) => <icons.SuccessIcon {...args} />,
};

export const CustomShapes: Story = {
  render: (args) => (
    <Icon {...args}>
      <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
    </Icon>
  ),
};

export const Gallery: Story = {
  render: () => (
    <ul className={styles.gallery}>
      {Object.entries(icons).map(([name, BuiltInIcon]) => (
        <li key={name} className={styles.item}>
          <BuiltInIcon size="lg" />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
};
