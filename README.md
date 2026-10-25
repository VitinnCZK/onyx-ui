# Onyx UI

A React + TypeScript component library and design system, built with accessibility, theming and developer experience as first-class concerns.

[![npm](https://img.shields.io/npm/v/@vitinnczk/onyx-ui)](https://www.npmjs.com/package/@vitinnczk/onyx-ui)
[![CI](https://github.com/VitinnCZK/onyx-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/VitinnCZK/onyx-ui/actions/workflows/ci.yml)
[![Release](https://github.com/VitinnCZK/onyx-ui/actions/workflows/release.yml/badge.svg)](https://github.com/VitinnCZK/onyx-ui/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

**[Live docs (Storybook)](https://vitinnczk.github.io/onyx-ui/)** · **[npm package](https://www.npmjs.com/package/@vitinnczk/onyx-ui)** · **[Changelog](./CHANGELOG.md)** · **[Roadmap](./docs/roadmap.md)**

## Contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Components](#components)
- [Theming](#theming)
- [Design tokens](#design-tokens)
- [Hooks and utilities](#hooks-and-utilities)
- [Accessibility](#accessibility)
- [Browser and framework support](#browser-and-framework-support)
- [Development](#development)
- [Contributing](#contributing)
- [Releasing](#releasing)
- [Design principles](#design-principles)
- [License](#license)

## Features

- **35 accessible components**: primitives, forms, feedback, overlays, navigation and data display, following the WAI-ARIA Authoring Practices for keyboard support, focus management and ARIA.
- **Themeable**: every visual decision is a design token exposed as a CSS custom property, with light, dark and system modes that meet WCAG AA contrast.
- **Fully typed**: strict TypeScript, including polymorphic components that render as another element with `as`.
- **Zero runtime styling**: plain CSS Modules and CSS variables, no CSS-in-JS overhead.
- **Tree-shakeable ESM**: one module per source file, so importing one component leaves the rest out of your bundle.
- **Server components friendly**: components ship marked with `'use client'`.
- **Documented and tested**: every component has Storybook docs, unit tests and automated accessibility checks (axe, keyboard, focus and 200% zoom).

## Installation

```bash
npm install @vitinnczk/onyx-ui
```

```bash
pnpm add @vitinnczk/onyx-ui
```

```bash
yarn add @vitinnczk/onyx-ui
```

`react` and `react-dom` (v18 or newer) are peer dependencies. The package is ESM-only and its only runtime dependency is [Floating UI](https://floating-ui.com), used to position overlays.

## Quick start

Import the stylesheet once, at the entry point of your app, and wrap the app in `ThemeProvider` (and `ToastProvider` if you use toasts):

```tsx
import '@vitinnczk/onyx-ui/styles.css';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, ToastProvider } from '@vitinnczk/onyx-ui';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="system">
    <ToastProvider>
      <App />
    </ToastProvider>
  </ThemeProvider>,
);
```

Then import the components you need:

```tsx
import { Button, FormField, Input, useToast } from '@vitinnczk/onyx-ui';

export function NewsletterForm() {
  const { toast } = useToast();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        toast({ intent: 'success', title: 'You are subscribed' });
      }}
    >
      <FormField label="Email" helperText="One email a month, no spam." required>
        <Input type="email" autoComplete="email" />
      </FormField>
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
```

`styles.css` holds the reset, the base styles, the tokens and both themes. Your own CSS can use the same tokens, so it follows the theme too:

```css
.sidebar {
  padding: var(--space-4);
  background: var(--color-surface);
  border-inline-end: var(--border-width-thin) solid var(--color-border);
}
```

### Next.js App Router

Components are marked with `'use client'`, so they can be rendered straight from server components such as `layout.tsx`. Hooks like `useToast` and `useTheme` still need a client component. To avoid a flash of the wrong theme before React hydrates, see **Server rendering and the first paint** in the [Theming guide](https://vitinnczk.github.io/onyx-ui/?path=/docs/theming-guide--docs).

## Components

Every component forwards its `ref`, accepts `className` and the native props of the element it renders, and has a Docs page in [Storybook](https://vitinnczk.github.io/onyx-ui/) with usage guidelines, live examples and a props table.

| Group            | Components                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Primitives**   | `Button`, `IconButton`, `Link`, `Text`, `Heading`, `Icon` (plus 16 ready-made icons), `Spinner`, `Badge`, `Avatar`, `Divider` |
| **Forms**        | `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup` / `Radio`, `Switch`, `Slider`, `FormField`                   |
| **Feedback**     | `Alert`, `Toast` (`ToastProvider` + `useToast`), `Progress`, `Skeleton`, `Tooltip`                                            |
| **Overlays**     | `Modal`, `Drawer`, `Popover`, `DropdownMenu`                                                                                  |
| **Navigation**   | `Tabs`, `Accordion`, `Breadcrumb`, `Pagination`                                                                               |
| **Data display** | `Card`, `Table`, `EmptyState`                                                                                                 |
| **Foundations**  | `ThemeProvider`, `Portal`, `VisuallyHidden`                                                                                   |

`FormField` wires the label, helper text and error message to its control with `aria-describedby` and `aria-invalid`, so form controls are accessible without extra props:

```tsx
<FormField label="Password" error={errors.password}>
  <Input type="password" autoComplete="new-password" />
</FormField>
```

Compound components keep each part small and composable:

```tsx
<Tabs defaultValue="account">
  <TabList aria-label="Settings">
    <Tab value="account">Account</Tab>
    <Tab value="billing">Billing</Tab>
  </TabList>
  <TabPanel value="account">…</TabPanel>
  <TabPanel value="billing">…</TabPanel>
</Tabs>
```

## Theming

`ThemeProvider` supports `light`, `dark` and `system` (follows `prefers-color-scheme`) and remembers the user's choice in `localStorage` under `storageKey` (`'onyx-theme'` by default). Read and change it with `useTheme`:

```tsx
import { Button, useTheme } from '@vitinnczk/onyx-ui';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="secondary"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      Toggle theme
    </Button>
  );
}
```

To create your own theme, override the tokens under a `data-theme` selector, load that CSS after `styles.css` and select it by name:

```css
[data-theme='brand'] {
  /* Semantic colors point at the palette, so override the steps they use (or the whole scale) */
  --color-primary-500: #8b5cf6;
  --color-primary-600: #7c3aed;
  --color-primary-700: #6d28d9;
  --radius-md: 4px;
  --font-family-base: 'Inter', system-ui, sans-serif;
}
```

```tsx
<ThemeProvider defaultTheme="brand">…</ThemeProvider>
```

The [Theming guide](https://vitinnczk.github.io/onyx-ui/?path=/docs/theming-guide--docs) covers dark-based themes, scoped themes, reduced motion, contrast checks and server rendering.

## Design tokens

Tokens are available as CSS custom properties and as JavaScript objects with the same values, for charts, canvas or tests:

| Category   | CSS variables                                                            | JavaScript                                                            |
| ---------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Color      | `--color-primary-500`, `--color-surface`, `--color-text`…                | `palette`, `baseColors`, `lightColors`, `darkColors`                  |
| Typography | `--font-family-*`, `--font-size-*`, `--font-weight-*`, `--line-height-*` | `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing` |
| Spacing    | `--space-*` (4px grid)                                                   | `spacing`                                                             |
| Shape      | `--radius-*`, `--border-width-*`, `--size-*`                             | `radius`, `borderWidth`, `sizes`                                      |
| Elevation  | `--shadow-*`, `--z-index-*`                                              | `shadows`, `zIndex`                                                   |
| Motion     | `--duration-*`, `--easing-*`                                             | `duration`, `easing`                                                  |
| Layout     | `--breakpoint-*`                                                         | `breakpoints`                                                         |

```ts
import { palette, spacing, themes } from '@vitinnczk/onyx-ui';
```

Components only use semantic colors, never the palette directly, so a theme only needs to redefine the semantic layer. See them all in [Foundations / Tokens](https://vitinnczk.github.io/onyx-ui/?path=/docs/foundations-tokens--docs).

## Hooks and utilities

The building blocks the components are made of are exported too:

| Export                 | What it does                                                                 |
| ---------------------- | ---------------------------------------------------------------------------- |
| `useControllableState` | State that works both controlled (`value`) and uncontrolled (`defaultValue`) |
| `useFocusTrap`         | Keeps focus inside a container and returns it on close                       |
| `useClickOutside`      | Calls a handler on pointer down outside one or more elements                 |
| `useEscapeKey`         | Calls a handler when Escape is pressed                                       |
| `useScrollLock`        | Locks page scroll while an overlay is open                                   |
| `cn`                   | Merges class names, skipping falsy values                                    |
| `Polymorphic*` types   | Types for components with an `as` prop                                       |

## Accessibility

Accessibility is part of the definition of done, not a later pass:

- Keyboard interaction for every widget follows the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) (arrow keys, Home/End, typeahead, Escape).
- Overlays trap focus, lock scroll and return focus to the trigger when they close.
- Every text and UI color pair meets WCAG AA contrast in both themes, checked by unit tests.
- Animations respect `prefers-reduced-motion`; primary controls have a touch target of at least 44px.
- Each component's unit tests include an axe check, and a Playwright suite runs axe, keyboard, focus-order and 200% zoom checks on every Storybook story in Chromium.

A manual screen reader pass is tracked in the [screen reader checklist](./docs/screen-reader-checklist.md).

## Browser and framework support

- React 18 and 19, with or without server components (Next.js App Router, Vite).
- Evergreen browsers (Chrome, Edge, Firefox and Safari) — the styles use modern CSS such as logical properties and `:focus-visible`.

## Development

Requires Node.js 24 (the version used in CI) and npm.

```bash
git clone https://github.com/VitinnCZK/onyx-ui.git
cd onyx-ui
npm install
npm run dev
```

`npm run dev` starts Storybook on <http://localhost:6006>.

| Script                    | Description                                                                 |
| ------------------------- | --------------------------------------------------------------------------- |
| `npm run dev`             | Start Storybook                                                             |
| `npm run build`           | Build the library into `dist/`                                              |
| `npm run build:storybook` | Build the static Storybook into `storybook-static/`                         |
| `npm test`                | Run the unit and axe tests with Vitest                                      |
| `npm run test:watch`      | Run Vitest in watch mode                                                    |
| `npm run test:a11y`       | Keyboard, focus, 200% zoom and axe checks on every story in Chromium        |
| `npm run lint`            | Lint with ESLint and typecheck                                              |
| `npm run typecheck`       | Typecheck only                                                              |
| `npm run format`          | Format with Prettier (`format:check` only checks)                           |
| `npm run check:package`   | Validate the packed package with publint and arethetypeswrong (after build) |
| `npm run check:bundle`    | Check that importing one component tree-shakes the rest (after build)       |
| `npm run changeset`       | Describe a change for the next release                                      |

`test:a11y` starts Storybook on its own (or reuses one already running on port 6006). Install its browser once with `npx playwright install chromium`.

### Project structure

```
src/
  tokens/          # design tokens as CSS variables and TypeScript objects
  styles/          # reset, base styles, themes and shared CSS modules
  components/
    Button/
      Button.tsx
      Button.module.css
      Button.stories.tsx
      Button.test.tsx
      index.ts
  hooks/           # shared hooks (useControllableState, useFocusTrap...)
  utils/           # helpers (cn, polymorphic types, floating positioning...)
  index.ts         # public API
a11y/              # Playwright accessibility suite that runs against Storybook
docs/              # roadmap and screen reader checklist
scripts/           # build checks (bundle size / tree-shaking)
```

### Tech stack

| Area        | Tool                                |
| ----------- | ----------------------------------- |
| Framework   | React 18+, TypeScript               |
| Build       | Vite (library mode)                 |
| Styling     | CSS Modules + CSS variables         |
| Positioning | Floating UI                         |
| Docs        | Storybook                           |
| Tests       | Vitest, Testing Library, vitest-axe |
| A11y tests  | Playwright, axe-core                |
| Quality     | ESLint, Prettier, Commitlint, Husky |
| Release     | Changesets, GitHub Actions          |

## Contributing

Issues and pull requests are welcome.

1. Fork the repository and create a branch from `main`.
2. Make your change with stories and tests. A new component follows the folder layout above and is exported from `src/index.ts`.
3. Run `npm run lint`, `npm test` and, for visual or interactive changes, `npm run test:a11y`.
4. Run `npm run changeset` if the change affects the published package.
5. Commit using [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `docs:`…) — Commitlint checks the message on commit — and open a pull request.

## Releasing

Versions and the changelog are managed with [Changesets](https://changesets.dev):

1. Run `npm run changeset` in the pull request that changes the library, pick the bump (patch, minor or major) and describe the change.
2. When it reaches `main`, the **Release** workflow opens (or updates) a "Version Packages" pull request with the new version and `CHANGELOG.md`.
3. Merging that pull request publishes the package to npm through trusted publishing, with provenance, and creates the git tag and GitHub release.

Every push and pull request runs the **CI** workflow (lint, typecheck, formatting, unit tests, build, package checks, Storybook build and the Playwright accessibility tests). On `main`, the Storybook is deployed to GitHub Pages once CI passes.

## Design principles

1. **Accessible first.** If it can't be used with a keyboard or a screen reader, it isn't done.
2. **Tokens over hardcoded values.** No component uses a raw color, size or spacing value.
3. **Composable APIs.** Small components that combine well beat large components with dozens of props.
4. **Predictable behavior.** Interaction patterns follow established standards instead of reinventing them.

## License

[MIT](./LICENSE) © Vítor Mello
