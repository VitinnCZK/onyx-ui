import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from './Portal.stories.module.css';
import { Portal } from '.';

const meta = {
  title: 'Foundations/Portal',
  component: Portal,
  parameters: {
    docs: {
      description: {
        component: `Renders its children into another node, \`document.body\` by default.

**When to use**

- Floating layers that must escape \`overflow\` and stacking contexts. The library overlays already use it.

**When not to use**

- Regular page content.

**Accessibility**

- The content moves in the DOM, so manage focus yourself: move it into the portalled content and back, as \`Modal\` and \`Popover\` do.`,
      },
    },
  },
} satisfies Meta<typeof Portal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className={styles.clipped}>
      <p>This box clips its overflow.</p>
      <p className={styles.note}>The notification is rendered in document.body, so it escapes.</p>
      <Portal {...args}>
        <aside aria-label="Notification" className={styles.floating}>
          Rendered through a portal
        </aside>
      </Portal>
    </div>
  ),
};

function CustomContainerDemo() {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <>
      <p className={styles.note}>Rendered before the target in the tree:</p>
      <Portal container={container}>
        <p>Portaled into the target below</p>
      </Portal>
      <div ref={setContainer} className={styles.target} />
    </>
  );
}

export const CustomContainer: Story = {
  render: () => <CustomContainerDemo />,
};
