# Roadmap

The plan that took Onyx UI from an empty repository to its first release, kept as a record of what is done and what is still open.

## 0. Project setup

- [x] Initialize repository with Vite in library mode + React + TypeScript (strict mode)
- [x] Configure ESLint, Prettier and `eslint-plugin-jsx-a11y`
- [x] Configure path aliases
- [x] Set up Vitest + Testing Library + vitest-axe
- [x] Set up Storybook with the a11y addon and theme switcher
- [x] Configure Commitlint with Conventional Commits
- [x] Add MIT license
- [x] Define the package `exports`, `types`, `sideEffects` and `peerDependencies` in `package.json`

## 1. Design tokens

- [x] Color palette (neutral, primary, success, warning, danger, info) with scales from 50 to 900
- [x] Semantic color tokens (`--color-bg`, `--color-surface`, `--color-text`, `--color-border`, `--color-focus`...)
- [x] Typography scale (font families, sizes, weights, line heights, letter spacing)
- [x] Spacing scale based on a 4px grid
- [x] Border radius scale
- [x] Shadow / elevation scale
- [x] Motion tokens (durations and easing curves)
- [x] Z-index scale (dropdown, overlay, modal, toast, tooltip)
- [x] Breakpoints
- [x] Verify all text/background combinations meet WCAG AA contrast (4.5:1 for text, 3:1 for UI elements)

## 2. Theming

- [x] Light theme
- [x] Dark theme
- [x] `ThemeProvider` with `light`, `dark` and `system` modes
- [x] Follow `prefers-color-scheme` in `system` mode
- [x] Persist the chosen theme
- [x] Respect `prefers-reduced-motion` in every animation
- [x] Document how to create a custom theme

## 3. Foundations

- [x] CSS reset and base styles
- [x] `cn` utility for merging class names
- [x] Polymorphic `as` prop type helper
- [x] `forwardRef` on every component
- [x] `useControllableState` (controlled and uncontrolled support)
- [x] `useFocusTrap`
- [x] `useClickOutside`
- [x] `useEscapeKey`
- [x] `Portal` component
- [x] `VisuallyHidden` component
- [x] Focus-visible ring style shared by all interactive components

## 4. Components

**Definition of done for every component** (apply to each item below):

- [x] Typed props with JSDoc descriptions
- [x] Variants and sizes where it makes sense
- [x] All states: default, hover, focus-visible, active, disabled, loading (when applicable)
- [x] Keyboard support following the WAI-ARIA Authoring Practices pattern
- [x] Works in light and dark themes
- [x] Responsive and usable on touch devices (minimum 44px touch target for primary controls)
- [x] Storybook stories covering every variant and state
- [x] Unit tests + axe accessibility test
- [x] Exported from `src/index.ts`

### Primitives

- [x] Button
- [x] IconButton
- [x] Link
- [x] Text
- [x] Heading
- [x] Icon
- [x] Spinner
- [x] Badge
- [x] Avatar
- [x] Divider

### Forms

- [x] Label
- [x] Input
- [x] Textarea
- [x] Select
- [x] Checkbox
- [x] Radio Group
- [x] Switch
- [x] Slider
- [x] FormField (label, helper text and error message wired with `aria-describedby`)

### Feedback

- [x] Alert
- [x] Toast (with queue, auto-dismiss and `aria-live`)
- [x] Progress
- [x] Skeleton
- [x] Tooltip

### Overlays

- [x] Modal / Dialog (focus trap, scroll lock, return focus on close)
- [x] Drawer
- [x] Popover
- [x] Dropdown Menu (arrow-key navigation, typeahead)

### Navigation

- [x] Tabs
- [x] Accordion
- [x] Breadcrumb
- [x] Pagination

### Data display

- [x] Card
- [x] Table (sorting, empty state, responsive overflow)
- [x] Empty State

## 5. Accessibility audit

- [x] Navigate every story using only the keyboard
- [ ] Test the main components with a screen reader (NVDA or VoiceOver), following [the checklist](./screen-reader-checklist.md)
- [x] Zero violations in the Storybook a11y addon
- [x] Check focus order and focus return in all overlays
- [x] Check 200% zoom does not break layouts

## 6. Documentation

- [x] Introduction page in Storybook (what it is, installation, principles)
- [x] Tokens page showing colors, typography and spacing visually
- [x] Theming guide
- [x] Auto-generated props tables for every component
- [x] Usage guidelines per component (when to use, when not to use)
- [x] Deploy Storybook to GitHub Pages

## 7. Build and publish

- [x] Build ESM output with type declarations
- [x] Ship a single `styles.css` export
- [x] Confirm tree-shaking works (import one component, check bundle size)
- [x] Configure Changesets for versioning and changelog
- [x] Publish first version to npm (as `@vitinnczk/ui`)
- [x] Publish `@vitinnczk/onyx-ui` and unpublish `@vitinnczk/ui`
- [ ] Test the published package in a fresh Vite and Next.js project (passed with the local `npm pack` tarball; repeat with the published package)

## 8. CI/CD

- [x] GitHub Actions: lint, typecheck, test and build on every push and pull request
- [x] Automatic Storybook deploy on merge to `main`
- [x] Automatic npm release through Changesets
- [ ] (Optional) Visual regression tests with Chromatic

## 9. Showcase

- [ ] Record a GIF for the README (components, theme switching, keyboard navigation)
- [x] Fill in the live docs and npm links in the README
- [ ] Pin the repository on the GitHub profile
- [ ] Use the library in the next portfolio projects
