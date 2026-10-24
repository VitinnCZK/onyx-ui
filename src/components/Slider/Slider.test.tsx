import { fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Slider } from '.';

describe('Slider', () => {
  it('renders a slider that starts at min', () => {
    render(<Slider aria-label="Volume" min={10} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });

    expect(slider).toHaveValue('10');
    expect(slider).toHaveAttribute('max', '100');
  });

  it('is focusable and reports value changes', async () => {
    const onValueChange = vi.fn();
    render(<Slider aria-label="Volume" defaultValue={50} step={5} onValueChange={onValueChange} />);
    const slider = screen.getByRole('slider');

    await userEvent.tab();
    expect(slider).toHaveFocus();

    fireEvent.change(slider, { target: { value: '55' } });
    expect(slider).toHaveValue('55');
    expect(onValueChange).toHaveBeenCalledWith(55);
  });

  it('fills the track up to the value', () => {
    const { container } = render(
      <Slider aria-label="Volume" min={0} max={200} defaultValue={50} />,
    );

    expect((container.firstChild as HTMLElement).style.getPropertyValue('--slider-progress')).toBe(
      '25%',
    );
  });

  it('formats the value for assistive technology and shows it', () => {
    render(
      <Slider
        aria-label="Opacity"
        defaultValue={40}
        formatValue={(value) => `${value}%`}
        showValue
      />,
    );

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '40%');
    expect(screen.getByText('40%')).toHaveAttribute('aria-hidden', 'true');
  });

  it('works as a controlled component', () => {
    function Controlled() {
      const [value, setValue] = useState(20);
      return (
        <Slider aria-label="Zoom" value={value} onValueChange={(next) => setValue(next * 2)} />
      );
    }
    render(<Controlled />);
    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: '30' } });

    expect(slider).toHaveValue('60');
  });

  it('supports the disabled and invalid states and forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <>
        <Slider ref={ref} aria-label="Disabled" disabled />
        <Slider aria-label="Invalid" invalid size="lg" className="custom" />
      </>,
    );

    expect(ref.current).toBe(screen.getByRole('slider', { name: 'Disabled' }));
    expect(ref.current).toBeDisabled();
    const invalid = screen.getByRole('slider', { name: 'Invalid' });
    expect(invalid).toHaveAttribute('aria-invalid', 'true');
    expect(invalid.parentElement).toHaveClass('slider', 'lg', 'custom');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="brightness">Brightness</label>
        <Slider id="brightness" defaultValue={70} showValue />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
