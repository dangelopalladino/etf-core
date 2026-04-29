# etf-core scratch — v1.5 visual verification harness

**Dev-only.** Not consumed by, importable from, or referenced in any consumer
app. Lives inside the etf-core repository under `scratch/` and is excluded
from the published package (only `dist/`, `CHANGELOG.md`, `README.md` ship per
`package.json` `files`).

Purpose: render every v1.5 primitive in three brand contexts (`shared`, `etf`,
`6id`) at four viewport widths (320 / 375 / 768 / 1280) so the visual
verification gate exists. Screenshots are captured by Playwright and committed
to the branch under `scratch/screenshots/`.

## Usage

```sh
cd scratch
npm install                          # one-time
npm run dev                          # http://localhost:3030
npm run capture                      # spins up server + runs Playwright capture
```

## Why a separate package.json?

To guarantee zero accidental coupling. The harness pins its own copies of
`next`, `react`, `tailwindcss`, etc. The primitives are imported via relative
path from `../src/ui-server` and `../src/ui-client` — there is no symlink to
`@dangelopalladino/etf-core` and no entry in the published tarball.

## Tailwind colors

The primitives reference `text-text-primary`, `text-accent`, `bg-surface`, etc.
These are defined in `tailwind.config.ts` here using the SHARED token values.
Consumer apps define their own equivalents in their own configs.
