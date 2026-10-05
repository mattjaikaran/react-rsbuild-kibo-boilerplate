# Dependencies

Every `package.json` dependency (dependencies and devDependencies) must be
listed here. Add a row when you add a dependency.

| Package                       | Version  |
| ----------------------------- | -------- |
| @dnd-kit/core                 | 6.3.1    |
| @dnd-kit/sortable             | 10.0.0   |
| @hookform/resolvers           | 5.2.2    |
| @radix-ui/react-checkbox      | 1.3.2    |
| @radix-ui/react-dialog        | 1.1.14   |
| @radix-ui/react-dropdown-menu | 2.1.14   |
| @radix-ui/react-label         | 2.1.6    |
| @radix-ui/react-popover       | 1.1.14   |
| @radix-ui/react-select        | 2.2.2    |
| @radix-ui/react-separator     | 1.1.4    |
| @radix-ui/react-slot          | 1.2.3    |
| @radix-ui/react-switch        | 1.2.2    |
| @radix-ui/react-tabs          | 1.1.12   |
| @radix-ui/react-toast         | 1.2.14   |
| @radix-ui/react-tooltip       | 1.2.7    |
| @rsbuild/core                 | 2.0.3    |
| @rsbuild/plugin-react         | 2.0.0    |
| @tailwindcss/postcss          | 4.2.4    |
| @tanstack/react-query         | 5.100.9  |
| @tanstack/react-router        | 1.169.2  |
| @tanstack/react-table         | 8.21.3   |
| @tanstack/router-plugin       | 1.167.34 |
| @testing-library/jest-dom     | 6.6.3    |
| @testing-library/react        | 16.3.0   |
| @testing-library/user-event   | 14.6.1   |
| @types/react                  | 19.2.0   |
| @types/react-dom              | 19.2.0   |
| @vitest/coverage-v8           | 4.1.5    |
| @vitest/ui                    | 4.1.5    |
| axios                         | 1.16.0   |
| class-variance-authority      | 0.7.1    |
| clsx                          | 2.1.1    |
| date-fns                      | 4.1.0    |
| jsdom                         | 29.1.1   |
| lucide-react                  | 1.14.0   |
| postcss                       | 8.5.14   |
| oxfmt                         | 0.72.0   |
| oxlint                        | 1.87.0   |
| react                         | 19.2.5   |
| react-day-picker              | 9.6.4    |
| react-doctor                  | 0.9.14   |
| react-dom                     | 19.2.5   |
| react-hook-form               | 7.75.0   |
| recharts                      | 3.8.1    |
| sonner                        | 2.0.3    |
| tailwind-merge                | 3.2.0    |
| tailwindcss                   | 4.2.4    |
| tw-animate-css                | 1.3.4    |
| typescript                    | 6.0.3    |
| vitest                        | 4.1.5    |
| zod                           | 4.4.3    |
| zustand                       | 5.0.13   |

Oxlint uses built-in TypeScript, React, and JSX accessibility plugins in
`.oxlintrc.json`, including Rules of Hooks and exhaustive dependency checks.
Oxfmt reads `.oxfmtrc.json`. Both exclude generated routes and build output;
there is no separate ESLint or Prettier pipeline.
The template does not enable React Compiler. Compiler-only refs, purity,
incompatible-library, and set-state-in-effect checks are not enabled in Oxlint;
Rules of Hooks and exhaustive dependency checks remain active. React Doctor
reads `doctor.config.json`; its existing ignore list preserves diagnostic scope.

Use the local React Doctor script. It does not fetch `latest`, send telemetry,
or run supply-chain checks. Keep `bun.lock` with the pinned dependency.
Run `bun run doctor` with Node `^20.19.0 || >=22.13.0`, as declared by
React Doctor. Do not use `bun --bun run doctor`: its IPC worker requires
Node. A completed scan can still report warnings; an error-only blocking
threshold does not make those warnings passes.
TypeScript uses ES2023 library types for the existing `toSorted` helper.
[ES2023 array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
require a compatible browser or a polyfill.
