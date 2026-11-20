import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

import { verifyPicomatchFinding } from "./picomatch-security-check.mjs";

// Validate the candidate without accepting the advisory while independent
// security review is blocked. Existing workspace exceptions remain unchanged.
const result = spawnSync("pnpm", ["audit", "--json"], {
  encoding: "utf8",
  timeout: 60000,
  maxBuffer: 10 * 1024 * 1024,
});
assert.ok(
  result.status === 0 || result.status === 1,
  result.stderr || String(result.error),
);
const audit = JSON.parse(result.stdout);
assert.ok(audit.metadata && audit.advisories, "Missing audit response");
let paths = 0;
for (const advisory of Object.values(audit.advisories)) {
  assert.equal(
    advisory.github_advisory_id,
    "GHSA-fc5q-39xc-vjpf",
    `Unmitigated advisory: ${advisory.github_advisory_id}`,
  );
  assert.equal(advisory.module_name, "picomatch");
  assert.ok(advisory.findings.length > 0);
  for (const finding of advisory.findings) {
    verifyPicomatchFinding(finding);
    paths += finding.paths.length;
  }
}
console.log(
  `Validated ${paths} candidate picomatch audit paths; security review remains blocked.`,
);
// Keep the candidate blocked even when the registry withdraws or omits a finding.
assert.fail(
  "Independent parser security review is blocked; do not merge or release this candidate.",
);
