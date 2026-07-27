import base from "magic-oxlint-config/base";
import { defineConfig } from "oxlint";

export default defineConfig({
  // `extends` drops the extended config's `ignorePatterns` (verified on oxlint
  // 1.75.0, see magic's DECISIONS.md), so the preset's list is re-declared here.
  ignorePatterns: base.ignorePatterns,
  extends: [base],
});
