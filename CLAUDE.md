# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose of this repo

Despite the generic Vite/React scaffolding, this project exists to exercise **Chromatic's CI behaviors** — TurboSnap (`--only-changed`), skipped builds (`--skip`), externals, and untraced globs. The component/animation library is test fixture material, not a product. When asked to change CI config, `package.json` scripts, or Storybook/Chromatic setup, assume the intent is to test Chromatic's behavior, and preserve the existing script variants (see below) unless told otherwise.

## Commands

```bash
npm run dev               # Vite dev server
npm run build              # tsc -b && vite build
npm run lint                # oxlint
npm run storybook           # Storybook dev server on port 6006
npm run build-storybook     # static Storybook build
```

There is no `test` script in `package.json`. Run tests directly with Vitest:

```bash
npx vitest run                                    # run all tests once
npx vitest                                        # watch mode
npx vitest run src/components/Button/Button.test.tsx   # single file
npx vitest run -t "renders the provided label"    # single test by name
```

Chromatic is invoked directly (project token is currently hardcoded in the scripts):

```bash
npm run chromatic:skip                  # --skip --exit-zero-on-changes
npm run chromatic:turbosnap             # --only-changed --exit-zero-on-changes (TurboSnap)
npm run chromatic:all                   # full run, no skipping/traversal limits
npm run chromatic:externals             # turbosnap + --externals "public/**"
npm run chromatic:untraced              # turbosnap + --untraced "modes-config/**"
npm run chromatic:untraced-externals    # turbosnap + both untraced and externals
npm run chromatic:onlystoryfiles        # turbosnap + --only-story-files filter
npm run chromatic:onlystorynames        # turbosnap + --only-story-names filter
```

CI runs Chromatic on every push via `.github/workflows/chromatic.yml`, using `onlyChanged: true` (TurboSnap) and `exitZeroOnChanges: true`, with `*.sass` and `public/**` externals. `fetch-depth: 0` is required in checkout for TurboSnap to compute a correct baseline.

## Architecture

- **Styling**: [Emotion](https://emotion.sh/) via the `css` prop (`jsxImportSource: "@emotion/react"` is set in `tsconfig.app.json`, so no `/** @jsx jsx */` pragma or wrapper import is needed per file). A single design-token theme (`src/tokens/tokens.ts` → `src/tokens/theme.ts`) is provided through Emotion's `ThemeProvider` in both `src/main.tsx` (the app) and `.storybook/preview.tsx` (Storybook). Components read tokens via `useTheme()`. The `Theme` type is augmented in `src/emotion.d.ts` to point at `AppTheme` for typed theme access.
- **Component layout**: every component lives in `src/components/<Name>/` with `<Name>.tsx`, `<Name>.stories.tsx`, `<Name>.test.tsx`, and a barrel `index.ts` re-exporting the default component and its props type. Multi-part components (e.g. `Form/`) hold several related components (`Form`, `Input`, `Checkbox`, `Label`, `TimeField`) plus a `LoginForm.test.tsx` that composes them. `src/components/animations/` follows the same per-folder convention for a set of standalone CSS/keyframe animation components.
- **Testing**: tests use Vitest's browser mode (Playwright/Chromium, configured in `vite.config.ts`) together with `@storybook/addon-vitest`'s `storybookTest()` plugin, which also runs every story as a test. Test files import `render` (and other testing-library-style helpers) from a **relative `test-setup` path that does not exist as a real file** — it's virtually provided/transformed at build time by the Storybook Vite plugin (component test transform) as part of Storybook's Component Testing feature. Don't try to create or "fix" a missing `test-setup.ts`; the import works because Vitest's config only runs through the `storybook` project defined in `vite.config.ts`.
- Tests also call `configure`/`takeSnapshot` from `@chromatic-com/vitest` to capture Chromatic snapshots at specific points within a test (independent of the story-level Chromatic snapshots), sometimes with a randomized `delay` (commented out in most files) to surface timing-related visual flakiness.
- **Linting**: `oxlint` (via `.oxlintrc.json`) with `react`, `typescript`, and `oxc` plugins; type-aware rules are not enabled (would require `oxlint-tsgolint`).
- **TypeScript**: project is split into `tsconfig.app.json` (src, DOM libs, bundler resolution) and `tsconfig.node.json` (build tooling, e.g. `vite.config.ts`), composed via the root `tsconfig.json` project references.
