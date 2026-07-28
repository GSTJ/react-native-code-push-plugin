/**
 * master requires status checks, and a brand new commit has none, so the
 * release workflow can't push the version bump straight to it. release-it
 * commits and tags locally, pushes only the tag (tags aren't covered by a
 * branch ruleset), and the workflow lands the bump commit through a PR.
 *
 * ESM rather than `.release-it.cjs` so the type list can live in
 * tools/changelog-preset.mjs and be shared with tools/changelog-check.mjs.
 * conventional-changelog-conventionalcommits is ESM-only, so a CJS config
 * could only reach it through a dynamic import.
 */
import { TYPES } from "./tools/changelog-preset.mjs";

const config = {
  git: {
    requireBranch: "master",
    commitMessage: "chore(release): v${version}",
    tagName: "v${version}",
    tagAnnotation: "v${version}\n\n${changelog}",
    // git strips lines starting with `#` from a tag message as comments, which
    // would drop every `###` heading including `⚠ BREAKING CHANGES`.
    tagArgs: ["--cleanup=verbatim"],
    // The workflow opens a PR for the bump commit instead.
    push: false,
    requireUpstream: false,
  },
  hooks: {
    // Push the annotated tag before the github plugin creates the release,
    // otherwise GitHub invents a lightweight tag at master's head and the
    // release points at the wrong commit with none of the changelog.
    //
    // This slot rather than `after:git:release` because `Git.release()` returns
    // the result of its push step, and release-it skips `after:` hooks on a
    // falsy return. With `push: false` that hook can never fire. Which also
    // means the tag only reaches the remote while `github.release` is on.
    "before:github:release": "git push origin refs/tags/${tagName}",
  },
  npm: {
    publish: true,
  },
  github: {
    release: true,
    releaseName: "v${version}",
  },
  plugins: {
    "@release-it/conventional-changelog": {
      infile: "CHANGELOG.md",
      header: "# Changelog",
      // There used to be a `commitFilter` here, meant to keep the
      // `chore(release)` bump commits out of the notes. The plugin never read
      // it: it destructures `preset`, `context`, `gitRawCommitsOpts`,
      // `parserOpts`, `writerOpts` and `whatBump`, and `commitFilter` appears
      // nowhere in its source. Nothing was lost by it doing nothing, because
      // the bump commits reach master as merge commits (both v1.0.12's and
      // v1.0.13's have two parents) and conventional-changelog skips those
      // anyway. Removing the key so the config stops claiming a behaviour it
      // never had.
      preset: {
        name: "conventionalcommits",
        types: TYPES,
      },
    },
  },
};

export default config;
