import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from '@/styles/story-layout.module.css';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '.';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    docs: {
      description: {
        component: `Trail of links from the home page to the current page.

**When to use**

- Hierarchies of three or more levels where people need to move up.

**When not to use**

- Flat sites, or as the main navigation.
- Steps of a linear process: use \`Progress\` or a list of steps.

**Accessibility**

- Renders a \`nav\` landmark named "Breadcrumb"; change it with \`aria-label\`.
- Mark the last link \`current\` so it gets \`aria-current="page"\`.
- Separators are hidden from assistive technology.`,
      },
    },
  },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Navigation</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#" current>
          Breadcrumb
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSeparator: Story = {
  args: { separator: '/' },
};

export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className={styles.narrow}>
        <Story />
      </div>
    ),
  ],
};
