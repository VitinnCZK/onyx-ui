import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './FocusRing.stories.module.css';

const meta = {
  title: 'Foundations/Focus ring',
  parameters: {
    docs: {
      description: {
        component:
          'Interactive components compose `focusRing` from `src/styles/focus-ring.module.css`. The ring uses `--color-focus`, `--focus-ring-width` and `--focus-ring-offset`, and only shows on keyboard focus (`:focus-visible`). Press Tab to move through the examples.',
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className={styles.demo}>
      <button type="button" className={styles.button}>
        Button
      </button>
      <a href="#focus-ring" className={styles.link}>
        Link
      </a>
      <input aria-label="Text field" placeholder="Text field" className={styles.input} />
    </div>
  ),
};
