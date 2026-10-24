import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import styles from '@/styles/story-layout.module.css';
import { Button } from '../Button';
import { Input } from '../Input';
import { Select } from '../Select';
import { Slider } from '../Slider';
import { Textarea } from '../Textarea';
import { FormField } from '.';

const meta = {
  title: 'Forms/FormField',
  component: FormField,
  args: {
    label: 'Email',
    helperText: 'We will only use it to send receipts.',
    children: <Input type="email" placeholder="you@example.com" />,
  },
  argTypes: {
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className={styles.stack}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: { error: 'Enter an email address like name@example.com.', required: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const HiddenLabel: Story = {
  args: {
    label: 'Search',
    hideLabel: true,
    helperText: undefined,
    children: <Input type="search" placeholder="Search…" />,
  },
};

export const Controls: Story = {
  render: () => (
    <>
      <FormField label="Bio" helperText="Markdown is supported.">
        <Textarea placeholder="Tell us about yourself" />
      </FormField>
      <FormField label="Country" error="Choose a country.">
        <Select placeholder="Select…">
          <option value="br">Brazil</option>
          <option value="pt">Portugal</option>
        </Select>
      </FormField>
      <FormField label="Volume" helperText="Applies to every device.">
        <Slider defaultValue={30} showValue />
      </FormField>
    </>
  ),
};

function ValidationDemo() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const error = submitted && !value.includes('@') ? 'Enter a valid email address.' : undefined;

  return (
    <form
      className={styles.stack}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <FormField label="Email" helperText="Used to sign in." error={error} required>
        <Input type="email" value={value} onChange={(event) => setValue(event.target.value)} />
      </FormField>
      <Button type="submit">Save</Button>
    </form>
  );
}

export const Validation: Story = {
  render: () => <ValidationDemo />,
};
