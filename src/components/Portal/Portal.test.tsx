import { act, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from '@/test/axe';
import { Portal } from '.';

describe('Portal', () => {
  it('renders its children at the end of document.body', () => {
    const { container } = render(
      <div>
        <Portal>
          <p>Floating</p>
        </Portal>
      </div>,
    );

    const content = screen.getByText('Floating');
    expect(container).not.toContainElement(content);
    expect(content.parentElement).toBe(document.body);
  });

  it('renders into a custom container', () => {
    const target = document.createElement('div');
    document.body.append(target);
    render(
      <Portal container={target}>
        <p>Inside target</p>
      </Portal>,
    );

    expect(target).toContainElement(screen.getByText('Inside target'));
    target.remove();
  });

  it('renders nothing while the container is null', () => {
    render(
      <Portal container={null}>
        <p>Waiting</p>
      </Portal>,
    );

    expect(screen.queryByText('Waiting')).not.toBeInTheDocument();
  });

  it('renders nothing on the server and hydrates without mismatches', async () => {
    const app = (
      <main>
        <Portal>
          <p>Hydrated</p>
        </Portal>
      </main>
    );
    const html = renderToString(app);
    expect(html).toBe('<main></main>');

    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.append(root);
    const onRecoverableError = vi.fn();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    const hydrated = await act(async () => hydrateRoot(root, app, { onRecoverableError }));

    expect(screen.getByText('Hydrated').parentElement).toBe(document.body);
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    act(() => hydrated.unmount());
    root.remove();
    error.mockRestore();
  });

  it('has no accessibility violations', async () => {
    render(
      <Portal>
        <aside aria-label="Notifications">
          <p>Saved</p>
        </aside>
      </Portal>,
    );

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
