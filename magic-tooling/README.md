# magic-tooling

Verification output for [#24](https://github.com/GSTJ/react-native-code-push-plugin/pull/24),
the migration onto the shared [GSTJ/magic](https://github.com/GSTJ/magic) lint and format stack.

| file | what it shows |
| --- | --- |
| `01-checks.txt` | cold `pnpm install --frozen-lockfile`, then lint, format, typecheck, test, build and `npm pack --dry-run`, with exit codes and a clean tree at the end |
| `02-lint-fails-the-build.txt` | one `console.log` on a throwaway branch, and the required `Lint, test and build` check going red because of it |
| `03-clean-project-install.txt` | the packed tarball installed into a fresh Expo SDK 50 app, all six mods writing their native config, and the output byte-identical to master |
| `04-tarball-diff.txt` | what the published tarball gains and loses: 36 files before and after, 30 renamed, the four unrenamed ones diffed |
| `05-kebab-and-config.txt` | the rename plan is empty, git recorded all 11 as renames, and the preset`s `ignorePatterns` really are loaded |
