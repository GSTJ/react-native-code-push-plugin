import type { PluginConfigType } from "../plugin-config";
import type { ConfigPlugin, IOSConfig } from "expo/config-plugins";

import { withAppDelegate } from "expo/config-plugins";

import { addBelowAnchorIfNotFound } from "../utils/add-below-anchor-if-not-found";
import { replaceIfNotFound } from "../utils/replace-if-not-found";

/**
 * What Expo reports for the app delegate it found. Taken from the function that
 * decides it rather than spelled out here, so a new language arrives as a type
 * error instead of a silently unhandled branch.
 */
type AppDelegateLanguage = ReturnType<
  typeof IOSConfig.Paths.getAppDelegate
>["language"];

/** Once this reads back, the file has already been through here. */
const SWIFT_BUNDLE_URL = "CodePush.bundleURL()";

const OBJC_BUNDLE_URL = "[CodePush bundleURL]";

/**
 * The release half of the template's `bundleURL`. The `#if DEBUG` half stays
 * put: dev builds have to keep loading from Metro, and CodePush has nothing to
 * serve them.
 *
 * Written as a pattern because Expo has reflowed the call's whitespace more
 * than once and the argument labels are the only stable part.
 */
const SWIFT_BINARY_BUNDLE =
  /Bundle\.main\.url\(\s*forResource:\s*"main",\s*withExtension:\s*"jsbundle"\s*\)/;

const OBJC_BINARY_BUNDLE = `[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"]`;

/**
 * Points the React runtime at whichever bundle CodePush picked.
 *
 * Expo SDK 53 rewrote `AppDelegate` in Swift, where the release bundle comes
 * from `ReactNativeDelegate.bundleURL()` and there's no `#import` line to hang
 * anything off. The Swift branch rewrites that one expression and leaves the
 * import to the bridging header, which `withIosBridgingHeaderDependency`
 * handles. SDK 50 through 52 stay on the Objective-C `AppDelegate.mm`.
 *
 * @throws If the file has neither shape. Failing quietly here is what #30 was.
 */
export function applyAppDelegate(
  contents: string,
  language: AppDelegateLanguage,
) {
  if (language === "swift") {
    if (contents.includes(SWIFT_BUNDLE_URL)) return contents;

    if (!SWIFT_BINARY_BUNDLE.test(contents)) {
      throw new Error(
        `Cannot point AppDelegate.swift at the CodePush bundle: there is no \`Bundle.main.url(forResource: "main", withExtension: "jsbundle")\` to replace. Expo's template returns that from \`ReactNativeDelegate.bundleURL()\`. If yours is customised, return \`${SWIFT_BUNDLE_URL}\` from there and the plugin will leave the file alone.`,
      );
    }

    return contents.replace(SWIFT_BINARY_BUNDLE, SWIFT_BUNDLE_URL);
  }

  const withImport = addBelowAnchorIfNotFound(
    contents,
    `#import "AppDelegate.h"`,
    `#import <CodePush/CodePush.h>`,
  );

  return replaceIfNotFound(
    withImport,
    OBJC_BINARY_BUNDLE,
    OBJC_BUNDLE_URL,
    "Cannot point AppDelegate at the CodePush bundle",
  );
}

/**
 * Makes the app delegate ask CodePush where the bundle is.
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
export const withIosAppDelegateDependency: ConfigPlugin<PluginConfigType> = (
  config,
) => {
  return withAppDelegate(config, (appDelegateProps) => {
    appDelegateProps.modResults.contents = applyAppDelegate(
      appDelegateProps.modResults.contents,
      appDelegateProps.modResults.language,
    );

    return appDelegateProps;
  });
};
