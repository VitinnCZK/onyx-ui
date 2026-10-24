import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Text } from '../Text';
import { Modal, type ModalSize } from '.';

const meta = {
  title: 'Overlays/Modal',
  component: Modal,
  args: {
    title: 'Invite a teammate',
    description: 'They will get an email with a link to join this workspace.',
    trigger: <Button>Invite teammate</Button>,
    children: (
      <FormField label="Email">
        <Input type="email" placeholder="name@example.com" />
      </FormField>
    ),
    footer: (
      <>
        <Button variant="ghost">Cancel</Button>
        <Button>Send invite</Button>
      </>
    ),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'full'] },
    role: { control: 'inline-radio', options: ['dialog', 'alertdialog'] },
    trigger: { control: false },
    children: { control: false },
    footer: { control: false },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div className={styles.row}>
      {(['sm', 'md', 'lg', 'full'] as ModalSize[]).map((size) => (
        <Modal
          key={size}
          {...args}
          size={size}
          title={`Size ${size}`}
          trigger={<Button variant="outline">Open {size}</Button>}
        />
      ))}
    </div>
  ),
};

export const LongContent: Story = {
  args: {
    title: 'Terms of service',
    description: undefined,
    children: Array.from({ length: 20 }, (_, index) => (
      <Text key={index} size="sm">
        Section {index + 1}. The body scrolls inside the dialog while the header and footer stay in
        place, and the page behind it does not scroll.
      </Text>
    )),
    footer: <Button>Accept</Button>,
  },
};

function ConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Delete project
      </Button>
      <Modal
        role="alertdialog"
        size="sm"
        open={open}
        onOpenChange={setOpen}
        closeOnOverlayClick={false}
        title="Delete this project?"
        description="All of its files and history will be removed. This cannot be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      />
    </>
  );
}

export const ControlledConfirmation: Story = {
  render: () => <ConfirmDemo />,
};
