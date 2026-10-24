import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Link } from '.';

const meta = {
  title: 'Primitives/Link',
  component: Link,
  args: { href: '#', children: 'Read the documentation' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'muted', 'inherit'] },
    external: { control: 'boolean' },
  },
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className={styles.stack}>
      <Link {...args} variant="default">
        Default link
      </Link>
      <Link {...args} variant="muted">
        Muted link
      </Link>
      <p>
        An{' '}
        <Link {...args} variant="inherit">
          inherit link
        </Link>{' '}
        takes the text color.
      </p>
    </div>
  ),
};

export const External: Story = {
  args: { href: 'https://www.w3.org/WAI/ARIA/apg/', external: true, children: 'ARIA practices' },
};

export const InParagraph: Story = {
  render: (args) => (
    <p>
      Links inside text stay underlined, so they never rely on color alone. See the{' '}
      <Link {...args}>accessibility guide</Link> for details.
    </p>
  ),
};
