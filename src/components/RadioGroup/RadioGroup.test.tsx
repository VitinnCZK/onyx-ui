import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Radio, RadioGroup, type RadioGroupProps } from '.';

function Plans(props: Partial<RadioGroupProps>) {
  return (
    <RadioGroup label="Plan" {...props}>
      <Radio value="free">Free</Radio>
      <Radio value="pro" description="For teams">
        Pro
      </Radio>
      <Radio value="enterprise" disabled>
        Enterprise
      </Radio>
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('renders a labelled radiogroup with radios sharing a name', () => {
    render(<Plans />);
    const radios = screen.getAllByRole('radio');

    expect(screen.getByRole('radiogroup', { name: 'Plan' })).toBeInTheDocument();
    expect(new Set(radios.map((radio) => radio.getAttribute('name'))).size).toBe(1);
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveAccessibleDescription('For teams');
  });

  it('selects the default value and calls onValueChange', async () => {
    const onValueChange = vi.fn();
    render(<Plans defaultValue="free" onValueChange={onValueChange} />);

    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();

    await userEvent.click(screen.getByText('Pro'));

    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('pro');
  });

  it('moves the selection with the arrow keys and skips disabled radios', async () => {
    const user = userEvent.setup();
    render(<Plans defaultValue="free" />);

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Free' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Pro' })).toHaveFocus();
  });

  it('works as a controlled component', async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>('pro');
      return (
        <>
          <Plans value={value} onValueChange={setValue} />
          <button type="button" onClick={() => setValue(null)}>
            Clear
          </button>
        </>
      );
    }
    render(<Controlled />);

    await userEvent.click(screen.getByText('Free'));
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
  });

  it('describes the group with the description and the error', () => {
    render(<Plans description="You can change it later." error="Pick a plan" required />);
    const group = screen.getByRole('radiogroup');

    expect(group).toHaveAccessibleDescription('You can change it later. Pick a plan');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('radio', { name: 'Free' })).toBeRequired();
  });

  it('disables every radio when the group is disabled', () => {
    render(<Plans disabled />);

    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });

  it('forwards the refs', () => {
    const groupRef = createRef<HTMLDivElement>();
    const radioRef = createRef<HTMLInputElement>();
    render(
      <RadioGroup ref={groupRef} label="Size" orientation="horizontal" size="sm">
        <Radio ref={radioRef} value="s">
          Small
        </Radio>
      </RadioGroup>,
    );

    expect(groupRef.current).toBe(screen.getByRole('radiogroup'));
    expect(radioRef.current).toBe(screen.getByRole('radio'));
  });

  it('throws when a Radio is rendered outside a RadioGroup', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<Radio value="x">Orphan</Radio>)).toThrow(/inside a RadioGroup/);
    vi.restoreAllMocks();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Plans defaultValue="pro" description="Billed monthly" />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
