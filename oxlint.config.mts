import base from "magic-oxlint-config/base";
import { defineConfig } from "oxlint";

export default defineConfig({
  // `extends` drops the extended config's `ignorePatterns` (verified on oxlint
  // 1.75.0, see magic's DECISIONS.md), so the preset's list is re-declared here.
  ignorePatterns: base.ignorePatterns,
  extends: [base],
  overrides: [
    {
      // `${version}` and friends in this file are release-it's own template
      // syntax, interpolated by release-it at release time. They are supposed
      // to reach it uninterpolated, so a real template literal would be the bug.
      files: [".release-it.cjs"],
      rules: { "no-template-curly-in-string": "off" },
    },
  ],
});
