import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    // Declaration files are only needed for the library build.
    viteConfig.plugins = viteConfig.plugins?.flat().filter((plugin) => {
      const name = plugin && 'name' in plugin ? plugin.name : '';
      return !name.includes('dts');
    });
    return viteConfig;
  },
};

export default config;
