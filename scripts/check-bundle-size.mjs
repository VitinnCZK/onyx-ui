// Bundles consumer entry points against dist/ to prove the package tree-shakes.
// Run after `npm run build`.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

const distEntry = fileURLToPath(new URL('../dist/index.js', import.meta.url));

// Gzipped size limits in bytes.
const SINGLE_COMPONENT_LIMIT = 3 * 1024;
const MAX_SHARE_OF_FULL_BUNDLE = 0.1;

const entries = {
  button: "export { Button } from '@vitinnczk/onyx-ui';",
  all: "export * from '@vitinnczk/onyx-ui';",
};

async function bundle(code) {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    resolve: { alias: { '@vitinnczk/onyx-ui': distEntry } },
    plugins: [
      {
        name: 'virtual-entry',
        resolveId: (id) => (id === 'virtual:entry' ? id : null),
        load: (id) => (id === 'virtual:entry' ? code : null),
      },
    ],
    build: {
      write: false,
      minify: true,
      rolldownOptions: {
        input: 'virtual:entry',
        preserveEntrySignatures: 'strict',
        external: [/^react($|\/)/, /^react-dom($|\/)/, /^@floating-ui\//],
      },
    },
  });
  const outputs = (Array.isArray(result) ? result[0] : result).output;
  const js = outputs
    .filter((file) => file.type === 'chunk')
    .map((file) => file.code)
    .join('\n');
  return {
    js,
    gzip: gzipSync(js).length,
    cssAssets: outputs.filter((file) => file.fileName.endsWith('.css')).length,
  };
}

if (!existsSync(distEntry)) {
  console.error('dist/index.js not found. Run `npm run build` first.');
  process.exit(1);
}

const button = await bundle(entries.button);
const all = await bundle(entries.all);
const kb = (bytes) => `${(bytes / 1024).toFixed(2)} kB`;

console.log(`Button only:    ${kb(button.gzip)} gzip`);
console.log(`Full library:   ${kb(all.gzip)} gzip`);
console.log(`Share of full:  ${((button.gzip / all.gzip) * 100).toFixed(1)}%`);

const failures = [];
if (button.gzip > SINGLE_COMPONENT_LIMIT) {
  failures.push(
    `Button bundle is ${kb(button.gzip)}, over the ${kb(SINGLE_COMPONENT_LIMIT)} limit.`,
  );
}
if (button.gzip > all.gzip * MAX_SHARE_OF_FULL_BUNDLE) {
  failures.push('Button bundle is not much smaller than the full library: tree-shaking is broken.');
}
if (button.js.includes('@floating-ui')) {
  failures.push('Button bundle pulls in @floating-ui: overlay code was not dropped.');
}
if (button.cssAssets > 0 || all.cssAssets > 0) {
  failures.push('The JS entry emitted CSS: component styles leak into the JS graph.');
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✖ ${failure}`);
  process.exit(1);
}
console.log('✔ Tree-shaking check passed.');
