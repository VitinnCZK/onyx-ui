import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from '@/test/axe';
import { Avatar } from '.';

describe('Avatar', () => {
  it('shows the initials as a named image without src', () => {
    render(<Avatar name="Ada Lovelace" />);
    const avatar = screen.getByRole('img', { name: 'Ada Lovelace' });

    expect(avatar).toHaveTextContent('AL');
    expect(avatar).toHaveClass('avatar', 'md', 'circle');
  });

  it('uses the first and last words for the initials', () => {
    render(
      <>
        <Avatar name="grace brewster murray hopper" />
        <Avatar name="Cher" />
      </>,
    );

    expect(screen.getByRole('img', { name: 'grace brewster murray hopper' })).toHaveTextContent(
      'GH',
    );
    expect(screen.getByRole('img', { name: 'Cher' })).toHaveTextContent('C');
  });

  it('renders the image and falls back to the initials when it fails', () => {
    const { rerender } = render(<Avatar name="Ada Lovelace" src="/ada.png" />);
    const image = screen.getByRole('img', { name: 'Ada Lovelace' });

    expect(image.tagName).toBe('IMG');

    fireEvent.error(image);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');

    rerender(<Avatar name="Ada Lovelace" src="/ada-2.png" />);
    expect(screen.getByRole('img').tagName).toBe('IMG');
  });

  it('uses a custom alt, size and shape and forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Avatar ref={ref} name="Acme" src="/acme.png" alt="Acme logo" size="xl" shape="square" />,
    );

    expect(screen.getByRole('img', { name: 'Acme logo' })).toBeInTheDocument();
    expect(ref.current).toHaveClass('xl', 'square');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <>
        <Avatar name="Ada Lovelace" />
        <Avatar name="Alan Turing" src="/alan.png" />
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
