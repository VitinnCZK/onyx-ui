import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './VisuallyHidden.stories.module.css';
import { VisuallyHidden } from '.';

const meta = {
  title: 'Foundations/VisuallyHidden',
  component: VisuallyHidden,
  args: { children: 'Close dialog' },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IconButtonLabel: Story = {
  render: (args) => (
    <button type="button" className={styles.iconButton}>
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
      <VisuallyHidden {...args} />
    </button>
  ),
};

export const AsLabel: Story = {
  args: { children: 'Search the docs' },
  render: (args) => (
    <>
      <VisuallyHidden as="label" htmlFor="docs-search" {...args} />
      <input id="docs-search" type="search" placeholder="Search…" className={styles.search} />
    </>
  ),
};
