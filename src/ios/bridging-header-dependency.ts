import type { PluginConfigType } from "../plugin-config";
import type { ConfigPlugin } from "expo/config-plugins";

import fs from "node:fs";
import path from "node:path";

import { IOSConfig, withDangerousMod } from "expo/config-plugins";

const CODE_PUSH_IMPORT = "#import <CodePush/CodePush.h>";

/**
 * `SWIFT_OBJC_BRIDGING_HEADER` as Xcode writes it, quoted or bare, with the
 * path relative to the `ios/` directory.
 */
const BRIDGING_HEADER_SETTING = /SWIFT_OBJC_BRIDGING_HEADER = "?([^"\n;]+)"?;/;

/** Appends the CodePush import to a bridging header. */
export function applyBridgingHeader(contents: string) {
  if (contents.includes(CODE_PUSH_IMPORT)) return contents;

  return `${contents.trimEnd()}\n\n${CODE_PUSH_IMPORT}\n`;
}

/**
 * Reads the bridging header's path out of the Xcode project.
 *
 * Expo's Swift template ships a `<name>-Bridging-Header.h` and points both
 * build configurations at it, so the build setting is the honest source for
 * where it lives rather than guessing from the project name.
 *
 * @throws If no configuration sets it, in which case Swift has no way to see
 *   CodePush's headers and there is nothing useful to write.
 */
export function findBridgingHeaderPath(pbxproj: string) {
  const relativePath = BRIDGING_HEADER_SETTING.exec(pbxproj)?.[1]?.trim();

  if (!relativePath) {
    throw new Error(
      "Cannot import CodePush into Swift: the Xcode project sets no SWIFT_OBJC_BRIDGING_HEADER. Add a bridging header to the app target and re-run prebuild.",
    );
  }

  return relativePath;
}

/**
 * Adds `#import <CodePush/CodePush.h>` to the bridging header so the Swift
 * `AppDelegate` can call `CodePush.bundleURL()`.
 *
 * CodePush is an Objective-C pod with no module map, so Swift cannot `import`
 * it. The bridging header is the only way in, and Expo generates an empty one
 * from SDK 53 on.
 *
 * Objective-C app delegates import CodePush directly and skip this.
 */
export const withIosBridgingHeaderDependency: ConfigPlugin<PluginConfigType> = (
  config,
) => {
  return withDangerousMod(config, [
    "ios",
    (dangerousConfig) => {
      const { projectRoot, platformProjectRoot } = dangerousConfig.modRequest;

      if (IOSConfig.Paths.getAppDelegate(projectRoot).language !== "swift") {
        return dangerousConfig;
      }

      const pbxprojPath = IOSConfig.Paths.getPBXProjectPath(projectRoot);
      const headerPath = path.join(
        platformProjectRoot,
        findBridgingHeaderPath(fs.readFileSync(pbxprojPath, "utf8")),
      );

      fs.writeFileSync(
        headerPath,
        applyBridgingHeader(fs.readFileSync(headerPath, "utf8")),
      );

      return dangerousConfig;
    },
  ]);
};
