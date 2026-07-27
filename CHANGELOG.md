# Changelog

## [1.0.12](https://github.com/GSTJ/react-native-code-push-plugin/compare/v1.0.11...v1.0.12) (2026-07-27)

* format the repo with oxfmt ([1e7a566](https://github.com/GSTJ/react-native-code-push-plugin/commit/1e7a566056099ec520c24b8658f35fc72061c3fb))

### Bug Fixes

* **android:** apply codepush.gradle without an `apply from:` anchor ([7d29583](https://github.com/GSTJ/react-native-code-push-plugin/commit/7d29583a51fc4e3dd7cc1df2caf8ea16acedaafd)), closes [#26](https://github.com/GSTJ/react-native-code-push-plugin/issues/26)
* **android:** hook CodePush into MainApplication's ReactHost ([0519cd7](https://github.com/GSTJ/react-native-code-push-plugin/commit/0519cd76b763440e20b961f428a3d6142299cc85))
* **build:** keep tsc's incremental cache out of the emit path ([2fe3574](https://github.com/GSTJ/react-native-code-push-plugin/commit/2fe3574e073c453de2e261a31b18245040debd7f))
* **lint:** clear the magic oxlint preset ([aa671ac](https://github.com/GSTJ/react-native-code-push-plugin/commit/aa671acbbf8153420971431166567024c1005f0b))

### Code Refactoring

* **android:** take ResourceXML from expo/config-plugins ([91b76ce](https://github.com/GSTJ/react-native-code-push-plugin/commit/91b76ceb2e89bfc83e575d05828dfc91421126bc))
* declare PluginConfigType as a type alias ([cc67b2a](https://github.com/GSTJ/react-native-code-push-plugin/commit/cc67b2a0e7fb517527a4cb6b16612776468da57b))
* kebab-case filenames ([6c0ef7a](https://github.com/GSTJ/react-native-code-push-plugin/commit/6c0ef7aa4ac7867692554396b85ea25a28967587))

### Documentation

* **ci:** note the check-approval gate on release PRs ([#23](https://github.com/GSTJ/react-native-code-push-plugin/issues/23)) ([3330f5e](https://github.com/GSTJ/react-native-code-push-plugin/commit/3330f5e4adb50be6ba2ae2dc0ca37ea6bf2d85ee))
* say which SDKs prebuild is tested against ([641ad2c](https://github.com/GSTJ/react-native-code-push-plugin/commit/641ad2c0a19c12bc039e1068fa1be734a66b26aa)), references [#import](https://github.com/GSTJ/react-native-code-push-plugin/issues/import)
* **tooling:** refresh the config comments for 1.2.0 ([39242cc](https://github.com/GSTJ/react-native-code-push-plugin/commit/39242cc08414d56cf6cee27e47b3e6d06225efc2))

### Build System

* **deps:** bump the magic packages to 1.1.0 ([327fa39](https://github.com/GSTJ/react-native-code-push-plugin/commit/327fa39b42244b82544a4adbebf15d7e1e2af00b))
* **deps:** bump the magic packages to 1.2.0 ([39b11d7](https://github.com/GSTJ/react-native-code-push-plugin/commit/39b11d79f2320d6699794aba2f678e83b320a117))
* **deps:** move to pnpm and swap eslint/prettier for the magic stack ([8a40864](https://github.com/GSTJ/react-native-code-push-plugin/commit/8a40864d1e60955113686e74861b72fd9cfab535))

### Continuous Integration

* call the shared workflow by tag instead of [@main](https://github.com/main) ([#29](https://github.com/GSTJ/react-native-code-push-plugin/issues/29)) ([46cc903](https://github.com/GSTJ/react-native-code-push-plugin/commit/46cc9036c0d029acc16bca175cec23e346d5f20b))
* **lint:** make a stale disable directive fail the build ([fd29026](https://github.com/GSTJ/react-native-code-push-plugin/commit/fd290262c729d166cfed553980b9576ae585b4a3))
* run the checks through GSTJ/magic and pnpm ([2a13c39](https://github.com/GSTJ/react-native-code-push-plugin/commit/2a13c39abb7af83b613d348a1e441cf6121b92bd))

### Chores

* extend the shared renovate preset ([cbf6fd2](https://github.com/GSTJ/react-native-code-push-plugin/commit/cbf6fd2ee2d333c3ac904e8c1c5abdc21cc0aadf))
* **tooling:** adopt the magic oxlint and oxfmt configs ([84a44dc](https://github.com/GSTJ/react-native-code-push-plugin/commit/84a44dc9582a383d118aed5e9a07ad6e518b51b2))
* **tooling:** drop the workarounds 1.1.0 made unnecessary ([46dc95b](https://github.com/GSTJ/react-native-code-push-plugin/commit/46dc95b5e93471f19561bccf0d4fad09bc8895ec))

## [1.0.11](https://github.com/GSTJ/react-native-code-push-plugin/compare/v1.0.10...v1.0.11) (2026-07-27)

### Continuous Integration

* say what to do when the release PR can't be opened ([#21](https://github.com/GSTJ/react-native-code-push-plugin/issues/21)) ([aa1e9d5](https://github.com/GSTJ/react-native-code-push-plugin/commit/aa1e9d5392eb5e8a20660d0329ba4c9fc5391794))

## [1.0.10](https://github.com/GSTJ/react-native-code-push-plugin/compare/v1.0.9...v1.0.10) (2026-07-27)

### Bug Fixes

* **release:** keep the changelog headings in the tag message ([0c6c8c1](https://github.com/GSTJ/react-native-code-push-plugin/commit/0c6c8c1b740858654b4ada1a062874be9302db22))

### Continuous Integration

* land release bumps through a PR instead of pushing to master ([#19](https://github.com/GSTJ/react-native-code-push-plugin/issues/19)) ([a7016d2](https://github.com/GSTJ/react-native-code-push-plugin/commit/a7016d264e5a4b14b1bdb8b3e9fe788e1357b60f))

## [1.0.9](https://github.com/GSTJ/react-native-code-push-plugin/compare/v1.0.8...v1.0.9) (2026-07-26)

### Bug Fixes

* **deps:** declare @babel/core ([#16](https://github.com/GSTJ/react-native-code-push-plugin/issues/16)) ([c1e6cf5](https://github.com/GSTJ/react-native-code-push-plugin/commit/c1e6cf53288f160121d7a8a32335958ed0997e8d))

### Documentation

* note App Center retirement and require CodePushServerURL ([#14](https://github.com/GSTJ/react-native-code-push-plugin/issues/14)) ([4e98a22](https://github.com/GSTJ/react-native-code-push-plugin/commit/4e98a223a1f1db960e5cfff3a1d297c5381d8d29))

### Continuous Integration

* add CI, CodeQL and release automation ([#18](https://github.com/GSTJ/react-native-code-push-plugin/issues/18)) ([09eeee1](https://github.com/GSTJ/react-native-code-push-plugin/commit/09eeee1e38d4031bbb39073c48e69b74382025f5)), references [#11](https://github.com/GSTJ/react-native-code-push-plugin/issues/11) [#14](https://github.com/GSTJ/react-native-code-push-plugin/issues/14)
* write the npm token in the release step ([5de4211](https://github.com/GSTJ/react-native-code-push-plugin/commit/5de4211eac5acc8ef3e4a75f381b51d50e4b96a9))

### Chores

* refresh yarn.lock to clear dev-only advisories ([#15](https://github.com/GSTJ/react-native-code-push-plugin/issues/15)) ([c6c05a3](https://github.com/GSTJ/react-native-code-push-plugin/commit/c6c05a34be3e9b8131ea08294d09ca55f433f536))
* scope resolutions to clear 6 dev-only Dependabot alerts ([#17](https://github.com/GSTJ/react-native-code-push-plugin/issues/17)) ([367e340](https://github.com/GSTJ/react-native-code-push-plugin/commit/367e3409db39bb82425d037f8746f826a19b2e20))

## [1.0.8](https://github.com/GSTJ/react-native-code-push-plugin/compare/1.0.7...v1.0.8) (2026-07-25)

### Features

- support self-hosted codepush servers ([#11](https://github.com/GSTJ/react-native-code-push-plugin/issues/11))

### Bug Fixes

- let node resolve the codepush gradle paths ([#12](https://github.com/GSTJ/react-native-code-push-plugin/issues/12))

## [1.0.7](https://github.com/GSTJ/react-native-code-push-plugin/compare/1.0.6...1.0.7) (2024-02-08)

### Bug Fixes

- kotlin/java semicolon build error ([#7](https://github.com/GSTJ/react-native-code-push-plugin/issues/7))

## 1.0.6 (2024-01-22)

### Features

- Expo SDK 50 support ([#5](https://github.com/GSTJ/react-native-code-push-plugin/issues/5))

### Bug Fixes

- Expo SDK 49 build error

## 1.0.2 (2023-11-06)

### Documentation

- update the interim README

## 1.0.0 (2023-11-06)

### Features

- Expo SDK 49 support
