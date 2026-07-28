import { extendConfig } from "magic-oxlint-config";
import base from "magic-oxlint-config/base";

// `extendConfig` flattens the preset into a single config rather than going
// through oxlint's `extends`, which is the only other supported shape and
// cannot carry `ignorePatterns` — oxlint has no per-override ignore, so
// magic-oxlint-config 1.2.0 stopped documenting `extends` entirely. Flattening
// carries the ignore list and the preset's `env`/`globals` by construction,
// with nothing local to drift from the preset.
export default extendConfig(base, {
  overrides: [
    {
      // tools/ holds the changelog preset and its control script. Printing to
      // the terminal is what the control is for, the CI job reads its output.
      files: ["tools/**"],
      rules: { "no-console": "off" },
    },
    {
      // `${version}` and friends in this file are release-it's own template
      // syntax, interpolated by release-it at release time. They are supposed
      // to reach it uninterpolated, so a real template literal would be the bug.
      files: [".release-it.mjs"],
      rules: { "no-template-curly-in-string": "off" },
    },
  ],
});
