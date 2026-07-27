/**
 * master requires status checks, and a brand new commit has none, so the
 * release workflow can't push the version bump straight to it. release-it
 * commits and tags locally, pushes only the tag (tags aren't covered by a
 * branch ruleset), and the workflow lands the bump commit through a PR.
 */
module.exports = {
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
      // Each release leaves a `chore(release)` bump commit and the merge commit
      // that lands it. Neither is worth a changelog line.
      commitFilter: (commit) =>
        !(commit.header ?? "").startsWith("chore(release)"),
      preset: {
        name: "conventionalcommits",
        types: [
          { type: "feat", section: "Features" },
          { type: "fix", section: "Bug Fixes" },
          { type: "perf", section: "Performance" },
          { type: "refactor", section: "Code Refactoring" },
          { type: "docs", section: "Documentation" },
          { type: "build", section: "Build System" },
          { type: "ci", section: "Continuous Integration" },
          { type: "chore", section: "Chores" },
          { type: "revert", section: "Reverts" },
          { type: "test", hidden: true },
          { type: "style", hidden: true },
        ],
      },
    },
  },
};
