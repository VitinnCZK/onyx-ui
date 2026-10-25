import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { palette } from '../src/tokens';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

addons.setConfig({
  theme: create({
    base: prefersDark ? 'dark' : 'light',
    brandTitle: 'Onyx UI',
    brandUrl: 'https://github.com/VitinnCZK/onyx-ui',
    brandTarget: '_blank',
    colorSecondary: prefersDark ? palette.primary[400] : palette.primary[600],
  }),
});
