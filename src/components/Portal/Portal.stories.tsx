import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from './Portal.stories.module.css';
import { Portal } from '.';

const meta = {
  title: 'Foundations/Portal',
  component: Portal,
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
