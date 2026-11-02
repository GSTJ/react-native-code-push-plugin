import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { env as processEnv } from "node:process";

const root = join(import.meta.dirname, "..");
const cli = join(root, "node_modules/release-it/bin/release-it.js");
const cases = [
  ["chore: maintain tooling", "", ""],
  ["build(deps): patch tooling", "", "2.0.2"],
  ["fix: correct plugin", "", "2.0.2"],
  ["feat: add option", "", "2.1.0"],
  [
    "ci!: change contract\n\nBREAKING CHANGE: migrate the contract",
    "",
    "3.0.0",
  ],
  ["chore: maintain tooling", "patch", "2.0.2"],
];
for (const [message, increment, expected] of cases) {
  const dir = mkdtempSync(join(tmpdir(), "code-push-release-check-"));
  const git = (...args) =>
    execFileSync("git", args, { cwd: dir, encoding: "utf8" }).trim();
  try {
    cpSync(join(root, ".release-it.mjs"), join(dir, ".release-it.mjs"));
    cpSync(join(root, "tools"), join(dir, "tools"), { recursive: true });
    symlinkSync(join(root, "node_modules"), join(dir, "node_modules"), "dir");
    writeFileSync(join(dir, ".gitignore"), "node_modules\n");
    writeFileSync(
      join(dir, "package.json"),
      '{"name":"react-native-code-push-plugin","version":"2.0.1"}\n',
    );
    git("init", "--quiet", "--initial-branch", "master");
    git("config", "user.name", "Gabriel Taveira");
    git("config", "user.email", "gabrielstaveira@gmail.com");
    git("add", ".");
    git("commit", "--quiet", "-m", "chore: initial");
    git("tag", "-a", "v2.0.1", "-m", "v2.0.1");
    git("commit", "--quiet", "--allow-empty", "-m", message);
    const before = git("rev-parse", "HEAD");
    assert.equal(
      git("log", "-1", "--format=%an <%ae>|%cn <%ce>"),
      "Gabriel Taveira <gabrielstaveira@gmail.com>|Gabriel Taveira <gabrielstaveira@gmail.com>",
    );
    const env = {
      ...processEnv,
      NPM_TOKEN: "",
      NODE_AUTH_TOKEN: "",
      GITHUB_TOKEN: "",
      npm_config_registry: "http://127.0.0.1:1",
    };
    const args = [
      cli,
      "--ci",
      "--release-version",
      "--npm.publish=false",
      "--github.release=false",
    ];
    if (increment) args.push(`--increment=${increment}`);
    const actual = execFileSync(process.execPath, args, {
      cwd: dir,
      env,
      encoding: "utf8",
      timeout: 30_000,
    }).trim();
    assert.equal(actual, expected, message);
    if (actual) {
      execFileSync(
        process.execPath,
        [
          cli,
          "--ci",
          "--dry-run",
          `--increment=${actual}`,
          "--npm.publish=false",
          "--github.release=false",
        ],
        { cwd: dir, env, stdio: "pipe", timeout: 30_000 },
      );
    }
    assert.equal(git("rev-parse", "HEAD"), before);
    assert.equal(git("status", "--porcelain"), "");
    assert.equal(git("tag"), "v2.0.1");
    const manifest = JSON.parse(readFileSync(join(dir, "package.json")));
    assert.equal(manifest.version, "2.0.1");
    console.log(
      `Release plan passed: ${message.split("\n")[0]} -> ${actual || "skip"}`,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
