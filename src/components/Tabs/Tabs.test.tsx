import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Tab, TabList, TabPanel, Tabs, type TabsProps } from '.';

function Example(props: Partial<TabsProps>) {
  return (
    <Tabs defaultValue="account" {...props}>
      <TabList aria-label="Settings">
        <Tab value="account">Account</Tab>
        <Tab value="security">Security</Tab>
        <Tab value="billing" disabled>
          Billing
        </Tab>
        <Tab value="team members">Team</Tab>
      </TabList>
      <TabPanel value="account">Account panel</TabPanel>
      <TabPanel value="security">Security panel</TabPanel>
      <TabPanel value="billing">Billing panel</TabPanel>
      <TabPanel value="team members">Team panel</TabPanel>
    </Tabs>
  );
}

const tab = (name: string) => screen.getByRole('tab', { name });

describe('Tabs', () => {
  it('links each tab to its panel and shows the selected one', () => {
    render(<Example />);
    const panel = screen.getByRole('tabpanel', { name: 'Account' });

    expect(screen.getByRole('tablist', { name: 'Settings' })).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    );
    expect(tab('Account')).toHaveAttribute('aria-selected', 'true');
    expect(tab('Account')).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveTextContent('Account panel');
    expect(screen.getByText('Security panel')).not.toBeVisible();
    expect(screen.getByText('Team panel')).toHaveAttribute('hidden');
  });

  it('keeps only the selected tab in the tab order', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    expect(tab('Account')).toHaveFocus();
    expect(tab('Security')).toHaveAttribute('tabindex', '-1');

    await user.tab();
    expect(screen.getByRole('tabpanel')).toHaveFocus();
  });

  it('selects with the arrow keys, skipping disabled tabs and wrapping around', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    await user.click(tab('Account'));
    await user.keyboard('{ArrowRight}');
    expect(tab('Security')).toHaveFocus();
    expect(tab('Security')).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{ArrowRight}');
    expect(tab('Team')).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith('team members');

    await user.keyboard('{ArrowRight}');
    expect(tab('Account')).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(tab('Team')).toHaveFocus();

    await user.keyboard('{Home}');
    expect(tab('Account')).toHaveFocus();
    await user.keyboard('{End}');
    expect(tab('Team')).toHaveFocus();
  });

  it('waits for Enter or Space in manual activation mode', async () => {
    const user = userEvent.setup();
    render(<Example activationMode="manual" />);

    await user.click(tab('Account'));
    await user.keyboard('{ArrowRight}');
    expect(tab('Security')).toHaveFocus();
    expect(tab('Account')).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Enter}');
    expect(tab('Security')).toHaveAttribute('aria-selected', 'true');
  });

  it('uses the up and down arrows when vertical', async () => {
    const user = userEvent.setup();
    render(<Example orientation="vertical" />);

    await user.click(tab('Account'));
    await user.keyboard('{ArrowRight}');
    expect(tab('Account')).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(tab('Security')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(tab('Account')).toHaveFocus();
  });

  it('works as a controlled component', async () => {
    const onValueChange = vi.fn();
    render(<Example value="security" onValueChange={onValueChange} />);

    await userEvent.click(tab('Account'));

    expect(onValueChange).toHaveBeenCalledWith('account');
    expect(tab('Security')).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps every tab reachable when nothing is selected', () => {
    render(<Example defaultValue={undefined} />);

    expect(tab('Account')).toHaveAttribute('tabindex', '0');
  });

  it('forwards the refs and applies the variant', () => {
    const ref = createRef<HTMLDivElement>();
    const tabRef = createRef<HTMLButtonElement>();
    render(
      <Tabs ref={ref} defaultValue="a" variant="solid" size="sm">
        <TabList aria-label="Example">
          <Tab ref={tabRef} value="a">
            A
          </Tab>
        </TabList>
        <TabPanel value="a">Panel</TabPanel>
      </Tabs>,
    );

    expect(ref.current).toHaveClass('tabs', 'solid', 'sm', 'horizontal');
    expect(tabRef.current).toBe(tab('A'));
  });

  it('throws when its parts are rendered outside Tabs', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Tab value="a">A</Tab>)).toThrow(/inside Tabs/);
    vi.restoreAllMocks();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Example />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
