import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '.';

const faq = [
  ['shipping', 'How long does shipping take?', 'Orders ship within 2 business days.'],
  ['returns', 'Can I return an item?', 'Yes, within 30 days of delivery, free of charge.'],
  ['warranty', 'Is there a warranty?', 'Every product has a one-year warranty.'],
  ['support', 'How do I contact support?', 'Write to support@example.com any time.'],
] as const;

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  args: { defaultValue: ['shipping'] },
  argTypes: {
    type: { control: 'inline-radio', options: ['single', 'multiple'] },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
  },
  render: (args) => (
    <div className={styles.stack}>
      <Accordion {...args}>
        {faq.map(([value, question, answer]) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {};

export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['shipping', 'returns'] },
};

export const NotCollapsible: Story = {
  args: { collapsible: false },
};

export const DisabledItem: Story = {
  render: (args) => (
    <div className={styles.stack}>
      <Accordion {...args}>
        {faq.map(([value, question, answer]) => (
          <AccordionItem key={value} value={value} disabled={value === 'warranty'}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
};
