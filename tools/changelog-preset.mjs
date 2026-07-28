// conventionalcommits preset, retuned so the changelog lists what actually
// ships. `.release-it.mjs` and `tools/changelog-check.mjs` both import this
// list, so the check can't pass against a policy the release doesn't use.
//
// `effect` replaces `hidden`, because `hidden` does nothing.
// conventional-changelog-conventionalcommits 10 reads `effect` and no other
// field, so `{ type: "style", hidden: true }` was never hidden. `style: format
// the repo with oxfmt` shipped in the v1.0.12 release body over an entry that
// claimed to suppress it, and it rendered with no section heading at all: the
// entry carried `hidden` instead of `section`, so the writer had no group to
// put it in and left it as a bare bullet above Bug Fixes.
//
// The split is by whether a type can change what npm hands a consumer.
// `files` is `["build", "app.plugin.js"]`:
//
//   renders   feat fix perf revert   the stock set
//             build                  tsconfig.build.json decides what lands
//                                    in build/
//             refactor               rewrites the source tsc emits from
//             chore                  dependency and config moves ship
//             docs                   README.md is inside the tarball
//
//   hidden    ci                     .github/ is not in `files`
//             style                  only `build/` ships, and oxfmt over
//                                    `src/` cannot move what tsc emits
//             test                   tests are not in `files`
//
// `effect: "changelog"` is the point: those types render without entering the
// bump count. Only the `bump` types can raise a version, so a cycle of nothing
// but `build:` and `docs:` commits recommends no release at all, not a patch.
// release-it handles that by exiting 0 with "No new version to release" and
// touching nothing, and the release workflow's `increment` input is there to
// force a version out anyway when one is wanted.
//
// Breaking changes are not configurable here and don't need to be. The
// preset's writer sets `discard = false` the moment a commit carries a note,
// so a `BREAKING CHANGE:` footer or a `!` renders its own section whatever
// type it hangs off, hidden ones included. tools/changelog-check.mjs is the
// control for that.
import createPreset from "conventional-changelog-conventionalcommits";

/** @type {import("conventional-changelog-conventionalcommits").CommitType[]} */
export const TYPES = [
  { type: "feat", section: "Features", effect: "bump" },
  { type: "feature", section: "Features", effect: "bump" },
  { type: "fix", section: "Bug Fixes", effect: "bump" },
  { type: "perf", section: "Performance", effect: "bump" },
  { type: "revert", section: "Reverts", effect: "bump" },
  { type: "build", section: "Build System", effect: "changelog" },
  { type: "refactor", section: "Code Refactoring", effect: "changelog" },
  { type: "chore", section: "Chores", effect: "changelog" },
  { type: "docs", section: "Documentation", effect: "changelog" },
  { type: "ci", section: "Continuous Integration", effect: "hidden" },
  { type: "style", section: "Styles", effect: "hidden" },
  { type: "test", section: "Tests", effect: "hidden" },
];

export default createPreset({ types: TYPES });
