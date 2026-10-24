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
  parameters: {
    docs: {
      description: {
        component: `Stack of sections whose content expands and collapses.

**When to use**

- Long, scannable content where readers only need some sections: FAQs, groups of settings, filters.

**When not to use**

- To switch between alternative views of the same area: use \`Tabs\`.
- For content most readers need: keep it visible instead of hiding it.

**Accessibility**

- Each trigger is a button inside a heading. Set \`headingLevel\` to fit the outline of the page.
- Up/Down arrows, Home and End move between triggers; Enter or Space toggles a section.
- An open section is a region labelled by its trigger.`,
      },
    },
  },
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
