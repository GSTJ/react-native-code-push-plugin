import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const hashes = {
  "2.3.2": "296547ec9d733720b648854bc52a4cfa1c255247336c10b0f6745433bd9e01f2",
  "4.0.5": "86a303b54f309277db4070784c140f955e4e73e5dd9862b813985c4e392ffd32",
};
export const picomatchEntries = new Map();
const store = new URL("../node_modules/.pnpm/", import.meta.url);
for (const directory of readdirSync(store).filter((name) =>
  name.startsWith("picomatch@"),
)) {
  const root = new URL(`${directory}/node_modules/picomatch/`, store);
  const { version } = JSON.parse(
    readFileSync(new URL("package.json", root), "utf8"),
  );
  assert.ok(hashes[version], `Unverified picomatch version: ${version}`);
  const digest = createHash("sha256")
    .update(readFileSync(new URL("lib/parse.js", root)))
    .digest("hex");
  assert.equal(digest, hashes[version], `Unpatched picomatch: ${directory}`);
  const entry = realpathSync(require.resolve(root.pathname));
  picomatchEntries.set(entry, version);
  const probe = spawnSync(
    process.execPath,
    [
      "-e",
      `
    const p = require(${JSON.stringify(entry)});
    const a = require('node:assert/strict');
    a.equal(p('+(a|b)')('abba'), true);
    a.equal(p('+(*(a))')('aaaa'), true);
    a.equal(p('+([ab])')('abba'), true);
    a.equal(p('+([*?])')('*?*'), true);
    a.equal(p(String.raw\`+(\\*)\`)('***'), true);
    a.equal(p('src/**/*.ts')('src/a/b.ts'), true);
    a.equal(p('+(file?.ts)')('file1.tsfile2.ts'), true);
    a.equal(p('+("*")')('***'), true);
    a.equal(p('+([[:alpha:]*])')('a*a'), true);
  `,
    ],
    { timeout: 3000, killSignal: "SIGKILL", encoding: "utf8" },
  );
  assert.equal(probe.status, 0, probe.stderr || String(probe.error));
  console.log(
    `picomatch ${version}: exact parser hash and benign compatibility probes passed`,
  );
}
assert.deepEqual(
  new Set(picomatchEntries.values()),
  new Set(Object.keys(hashes)),
);

// Resolve every edge from the project, including packages with only type exports.
export const verifyPicomatchFinding = (finding) => {
  assert.ok(finding.paths.length > 0, "Missing audit dependency paths");
  for (const path of finding.paths) {
    const names = path.split(">");
    assert.equal(names.shift(), ".");
    assert.equal(names.at(-1), "picomatch");
    let entry = new URL("../package.json", import.meta.url).pathname;
    for (const name of names) {
      const from = createRequire(entry);
      try {
        entry = from.resolve(`${name}/package.json`);
      } catch {
        entry = from.resolve(name);
      }
    }
    // Normalize package.json to its public entry before comparing real paths.
    const resolved = createRequire(entry).resolve("picomatch");
    assert.equal(
      picomatchEntries.get(realpathSync(resolved)),
      finding.version,
      `Unverified audit path: ${path}`,
    );
  }
};
