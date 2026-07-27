import type { PluginConfigType } from "../plugin-config";
import type { ConfigPlugin } from "expo/config-plugins";

import { withAppDelegate } from "expo/config-plugins";

import { addBelowAnchorIfNotFound } from "../utils/add-below-anchor-if-not-found";
import { replaceIfNotFound } from "../utils/replace-if-not-found";

/**
 * Makes the app delegate aware of the CodePush bundle location.
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
export const withIosAppDelegateDependency: ConfigPlugin<PluginConfigType> = (
  config,
  _props,
) => {
  return withAppDelegate(config, (appDelegateProps) => {
    appDelegateProps.modResults.contents = addBelowAnchorIfNotFound(
      appDelegateProps.modResults.contents,
      `#import "AppDelegate.h"`,
      `#import <CodePush/CodePush.h>`,
    );

    appDelegateProps.modResults.contents = replaceIfNotFound(
      appDelegateProps.modResults.contents,
      `return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`,
      `return [CodePush bundleURL];`,
    );

    return appDelegateProps;
  });
};
