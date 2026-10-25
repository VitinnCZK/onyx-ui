# @vitinnczk/onyx-ui

## 0.2.0

### Minor Changes

- b35c9d1: Renamed the package from `@vitinnczk/ui` to `@vitinnczk/onyx-ui` and the repository to `VitinnCZK/onyx-ui`. Update your imports (`@vitinnczk/onyx-ui` and `@vitinnczk/onyx-ui/styles.css`). The default `ThemeProvider` `storageKey` is now `'onyx-theme'` (was `'vui-theme'`) and the generated class names start with `onyx-` instead of `vui-`.

### Patch Changes

- eaa74b5: Publish from GitHub Actions through npm trusted publishing, so the package now ships with a signed provenance attestation.

## 0.1.0

### Minor Changes

- 035c571: First public release: design tokens, light and dark themes with `ThemeProvider`, hooks and 35 accessible components (primitives, forms, feedback, overlays, navigation and data display), shipped as tree-shakeable ESM with type declarations and a single `styles.css`.
