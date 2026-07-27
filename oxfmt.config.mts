import { base } from "magic-oxfmt-config";

export default {
  ...base,
  ignorePatterns: [
    ...(base.ignorePatterns ?? []),
    // Rewritten by @release-it/conventional-changelog on every release, with
    // `*` bullets that oxfmt turns into `-`. Formatting it here would make the
    // release workflow's own bump PR fail the format check.
    "CHANGELOG.md",
  ],
};
