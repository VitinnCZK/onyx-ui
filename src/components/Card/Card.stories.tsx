import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { Progress } from '../Progress';
import { Text } from '../Text';
import { Card, CardBody, CardFooter, CardHeader, type CardOwnProps } from '.';

const meta = {
  title: 'Data display/Card',
  component: Card,
  parameters: {
    docs: {
      description: {
        component: `Surface that groups related content, laid out with \`CardHeader\`, \`CardBody\` and \`CardFooter\`.

**When to use**

- Summaries of an entity (a plan, a project, a product) in a grid or list, or a group of related settings.

**When not to use**

- Only to add a border or spacing to a page section.
- Cards inside cards.

**Accessibility**

- A \`div\` by default. Use \`as="article"\` or \`as="section"\` with \`aria-labelledby\` pointing at its heading when it stands on its own.
- Avoid making the whole card clickable when it has other actions inside: put a \`Link\` in the heading.`,
      },
    },
  },
  args: { variant: 'outline', padding: 'md' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'elevated', 'filled'] },
    padding: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
  },
  render: (args) => (
    <div className={styles.stack}>
      <Card {...args} as="section" aria-labelledby="card-title">
        <CardHeader>
          <Heading id="card-title" level={3} size="lg">
            Pro plan
          </Heading>
          <Badge intent="success">Active</Badge>
        </CardHeader>
        <CardBody>
          <Text size="sm" tone="muted">
            Renews on 1 December. You are using 12 of 20 seats.
          </Text>
          <Progress aria-label="Seats used" value={12} max={20} />
        </CardBody>
        <CardFooter>
          <Button variant="ghost">Cancel plan</Button>
          <Button>Manage seats</Button>
        </CardFooter>
      </Card>
    </div>
  ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Outline: Story = {};

export const Elevated: Story = {
  args: { variant: 'elevated' },
};

export const Filled: Story = {
  args: { variant: 'filled' },
};

export const Paddings: Story = {
  render: (args) => (
    <div className={styles.stack}>
      {(['none', 'sm', 'md', 'lg'] as CardOwnProps['padding'][]).map((padding) => (
        <Card key={padding} {...args} padding={padding}>
          <CardBody>
            <Text size="sm">padding=&quot;{padding}&quot;</Text>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};
