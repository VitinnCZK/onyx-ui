import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  type AccordionProps,
} from '.';

function Example(props: Partial<AccordionProps>) {
  return (
    <Accordion {...props}>
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>Ships in 2 days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>30-day returns.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="warranty" disabled>
        <AccordionTrigger>Warranty</AccordionTrigger>
        <AccordionContent>One year.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>Support</AccordionTrigger>
        <AccordionContent>Email us.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const trigger = (name: string) => screen.getByRole('button', { name });

describe('Accordion', () => {
  it('renders headings with buttons that control their regions', () => {
    render(<Example defaultValue={['shipping']} />);
    const region = screen.getByRole('region', { name: 'Shipping' });

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(4);
    expect(trigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(trigger('Shipping')).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveTextContent('Ships in 2 days.');
    expect(trigger('Returns')).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('30-day returns.')).not.toBeVisible();
  });

  it('keeps one section open at a time in single mode', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    await userEvent.click(trigger('Shipping'));
    await userEvent.click(trigger('Returns'));

    expect(trigger('Shipping')).toHaveAttribute('aria-expanded', 'false');
    expect(trigger('Returns')).toHaveAttribute('aria-expanded', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(['returns']);

    await userEvent.click(trigger('Returns'));
    expect(trigger('Returns')).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps the open section open when not collapsible', async () => {
    render(<Example defaultValue={['shipping']} collapsible={false} />);

    await userEvent.click(trigger('Shipping'));

    expect(trigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(trigger('Shipping')).toHaveAttribute('aria-disabled', 'true');
  });

  it('opens several sections in multiple mode', async () => {
    render(<Example type="multiple" />);

    await userEvent.click(trigger('Shipping'));
    await userEvent.click(trigger('Returns'));

    expect(trigger('Shipping')).toHaveAttribute('aria-expanded', 'true');
    expect(trigger('Returns')).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles with Enter and Space and moves between headers with the arrow keys', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    await user.keyboard('{Enter}');
    expect(trigger('Shipping')).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{ArrowDown}');
    expect(trigger('Returns')).toHaveFocus();
    await user.keyboard(' ');
    expect(trigger('Returns')).toHaveAttribute('aria-expanded', 'true');

    await user.keyboard('{ArrowDown}');
    expect(trigger('Support')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(trigger('Shipping')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(trigger('Support')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(trigger('Shipping')).toHaveFocus();
    await user.keyboard('{End}');
    expect(trigger('Support')).toHaveFocus();
  });

  it('disables a section', () => {
    render(<Example />);

    expect(trigger('Warranty')).toBeDisabled();
  });

  it('works as a controlled component', async () => {
    const onValueChange = vi.fn();
    render(<Example value={[]} onValueChange={onValueChange} />);

    await userEvent.click(trigger('Support'));

    expect(onValueChange).toHaveBeenCalledWith(['support']);
    expect(trigger('Support')).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses the heading level and forwards the refs', () => {
    const ref = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    render(
      <Accordion ref={ref} headingLevel={2}>
        <AccordionItem value="a">
          <AccordionTrigger ref={triggerRef}>A</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'A' })).toBeInTheDocument();
    expect(ref.current).toHaveClass('accordion');
    expect(triggerRef.current).toBe(trigger('A'));
  });

  it('throws when its parts are rendered outside an Accordion', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<AccordionItem value="a" />)).toThrow(/inside an Accordion/);
    vi.restoreAllMocks();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Example defaultValue={['returns']} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
