import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/index.css';
import { DocsContainer } from './DocsContainer';

const withToolbarTheme = withThemeByDataAttribute({
  themes: {
    light: 'light',
    dark: 'dark',
  },
  defaultTheme: 'light',
  attributeName: 'data-theme',
});

// Stories that set `parameters.themes.disable` (e.g. ThemeProvider) own `data-theme` themselves.
const withTheme: Decorator = (Story, context) =>
  context.parameters.themes?.disable ? Story() : withToolbarTheme(Story, context);

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    docs: {
      container: DocsContainer,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Fail stories with accessibility violations instead of only reporting them.
      test: 'error',
    },
  },
  decorators: [withTheme],
};

export default preview;
