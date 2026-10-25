import type { Meta, StoryObj } from '@storybook/react-vite';
import styles from './ThemeProvider.stories.module.css';
import { ThemeProvider, useTheme, type Theme } from '.';

const meta = {
  title: 'Theming/ThemeProvider',
  component: ThemeProvider,
  args: { defaultTheme: 'system', storageKey: 'onyx-theme-storybook' },
  argTypes: {
    defaultTheme: { control: 'inline-radio', options: ['light', 'dark', 'system'] },
  },
  parameters: {
    docs: {
      // Rendered inline, it would switch the theme of the whole docs page.
      story: { inline: false, iframeHeight: 200 },
      description: {
        component: `Applies a theme to the page by setting \`data-theme\` on \`<html>\` and remembers the choice. See the Theming guide.

**When to use**

- Once, at the root of the app.

**When not to use**

- Theming part of the page: set \`data-theme\` on a container instead of nesting providers.

**Accessibility**

- \`system\` follows \`prefers-color-scheme\`; both built-in themes meet WCAG AA contrast.
- Offer an explicit theme control built with \`useTheme\`.`,
      },
    },
    // ThemeProvider owns `data-theme` here, so the toolbar switcher is hidden.
    themes: { disable: true },
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

const modes: Theme[] = ['light', 'dark', 'system'];

function ThemePicker() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className={styles.demo}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Theme</legend>
        {modes.map((mode) => (
          <label key={mode} className={styles.option}>
            <input
              type="radio"
              name="theme"
              value={mode}
              checked={theme === mode}
              onChange={() => setTheme(mode)}
            />
            {mode}
          </label>
        ))}
      </fieldset>
      <p className={styles.status} aria-live="polite">
        Applied theme: <strong>{resolvedTheme}</strong>
      </p>
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <ThemeProvider {...args}>
      <ThemePicker />
    </ThemeProvider>
  ),
};
