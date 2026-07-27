import { extendConfig } from "magic-oxlint-config";
import base from "magic-oxlint-config/base";

// `extendConfig` flattens the preset into a single config rather than going
// through oxlint's `extends`, which still drops `ignorePatterns` on oxlint
// 1.75.0 + magic-oxlint-config 1.1.0 — verified with `oxlint --print-config`
// and by linting a probe file under `**/generated/**`. Flattening means there
// is no re-declared ignore list here to drift from the preset's.
export default extendConfig(base, {
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
