/// <reference types="vitest/config" />
import { existsSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));
const distDir = fileURLToPath(new URL('./dist', import.meta.url));

// Node16/NodeNext resolution needs explicit extensions, so "./Button" becomes "./Button.js"
// (or "./Button/index.js") in the emitted declarations.
function addDeclarationExtensions(filePath: string, content: string) {
  const fromDir = join(srcDir, relative(distDir, dirname(filePath)));
  return content.replace(
    /((?:from|import)\s*\(?\s*)(['"])(\.\.?\/[^'"]+)\2/g,
    (match, prefix: string, quote: string, specifier: string) => {
      const target = join(fromDir, specifier);
      const has = (path: string) => existsSync(`${path}.ts`) || existsSync(`${path}.tsx`);
      if (has(target)) return `${prefix}${quote}${specifier}.js${quote}`;
      if (has(join(target, 'index'))) return `${prefix}${quote}${specifier}/index.js${quote}`;
      return match;
    },
  );
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      beforeWriteFile: (filePath, content) => ({
        content: addDeclarationExtensions(filePath, content),
      }),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: 'vui-[local]-[hash:base64:5]',
    },
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      cssFileName: 'styles',
    },
    sourcemap: true,
    rolldownOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@floating-ui\//],
      output: {
        // One output file per source module keeps the package tree-shakeable.
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        // React Server Components (e.g. the Next.js App Router) need components marked as client modules.
        banner: (chunk) =>
          /[\\/]src[\\/]components[\\/].+\.tsx$/.test(chunk.facadeModuleId ?? '')
            ? "'use client';"
            : '',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: {
      modules: { classNameStrategy: 'non-scoped' },
    },
  },
});
