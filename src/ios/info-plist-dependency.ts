import type { PluginConfigType } from "../plugin-config";
import type { ConfigPlugin } from "expo/config-plugins";

import { withInfoPlist } from "expo/config-plugins";

/**
 * Sets the CodePushServerURL and CodePushDeploymentKey in the iOS Info.plist
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
export const withIosInfoPlistDependency: ConfigPlugin<PluginConfigType> = (
  config,
  props,
) => {
  if (!props?.ios?.CodePushServerURL) {
    throw new Error(
      "You need to provide the `CodePushServerURL` iOS property for react-native-code-push-plugin to work. App Center is retired, so the default server no longer works.",
    );
  }

  if (!props?.ios?.CodePushDeploymentKey) {
    throw new Error(
      "You need to provide the `CodePushDeploymentKey` iOS property for react-native-code-push-plugin to work.",
    );
  }

  return withInfoPlist(config, (infoPlistProps) => {
    infoPlistProps.modResults.CodePushServerURL = props.ios.CodePushServerURL;

    infoPlistProps.modResults.CodePushDeploymentKey =
      props.ios.CodePushDeploymentKey;

    return infoPlistProps;
  });
};
