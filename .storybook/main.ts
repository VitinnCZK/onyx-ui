import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    // The default `react-docgen` can't read the polymorphic components' props.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Inherited DOM attributes and `ref` would bury each component's own props.
      propFilter: (prop) => prop.name !== 'ref' && !prop.parent?.fileName.includes('node_modules'),
    },
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
