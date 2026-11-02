# Security Policy

## Reporting a Vulnerability

Report it privately through GitHub's advisory form:
https://github.com/GSTJ/react-native-code-push-plugin/security/advisories/new

Don't open a public issue for a security problem.

## Supported Versions

Fixes ship in a new release off the latest published version. Stay on it; there are no backport branches.

## Tooling

Development installs use basic-ftp 6, Zod 4, minimatch 11 and glob 14 for their security fixes. These overrides stay in pnpm's workspace configuration; they do not change the plugin's Expo peer requirement or public configuration.

- basic-ftp keeps the Client methods used by release-it's get-uri dependency. The Unix listing parser is checked in a timed child process.
- Expo CLI's plugin and output schemas run against Zod 4. Oversized constrained arrays must fail before parsing their elements, including asynchronous parsing.
- The minimatch patch adds a callable CommonJS export for ESLint and glob 7 while retaining the modern named exports. The pattern-amplification regression runs with a timeout.
- Modern glob callers use glob 14. The checks cover normal file matching and rejection of an already-cancelled walk.
- deepmerge 4.3.2 is named by the registry advisory but is unpublished. Our 4.3.1 patch skips `__proto__` keys when copying either merge operand, including null-prototype inputs, in the source and both bundled builds. The security checks exercise these cases and ordinary nested/array merges. Remove the patch and its advisory exception together once a fixed upstream release is available and passes these checks.

`pnpm run security:check` runs the installed-package regressions before the high-severity audit gate. The deepmerge exception is limited to GHSA-gcqx-w48m-w2h4, alongside the existing patched image-size exceptions. Keep these checks in the test command and release workflow.

## Development

Use Node 24 and the pinned pnpm version. We use Jest 30 with a TypeScript transformer for these Node-based config-plugin tests. Type checking runs separately. The old expo-module-scripts package and its `expo-module` command are removed; use `pnpm run build`, `pnpm run clean` and `pnpm run test` directly. Jest mocks that require Babel hoisting need explicit setup before importing the module under test.

These are contributor tooling changes. Consumers keep the same plugin options. Security commits under `build(deps)` deliberately recommend a patch release under our changelog policy; ordinary chore, build and docs commits alone recommend no release. Public breaking changes still require a conventional breaking-change note with migration instructions, which the shared preset carries into the changelog, release body and annotated tag.
