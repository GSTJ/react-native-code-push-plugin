import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";

import { PluginConfigType } from "../pluginConfig";

/**
 * Sets the CodePushServerURL and CodePushDeploymentKey in the iOS Info.plist
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
export const withIosInfoPlistDependency: ConfigPlugin<PluginConfigType> = (
  config,
  props
) => {
  // if (!props?.ios?.CodePushServerURL) {
  //   throw new Error(
  //       "You need to provide the `CodePushServerURL` IOS property for the @config-plugins/react-native-code-push plugin to work."
  //   );
  // }

  if (!props?.ios?.CodePushDeploymentKey) {
    throw new Error(
        "You need to provide the `CodePushDeploymentKey` IOS property for the @config-plugins/react-native-code-push plugin to work."
    );
  }

  return withInfoPlist(config, (infoPlistProps) => {
    if (props?.ios?.CodePushServerURL) {
      infoPlistProps.modResults.CodePushServerURL =
          props?.ios?.CodePushServerURL;
    }

    infoPlistProps.modResults.CodePushDeploymentKey =
      props.ios.CodePushDeploymentKey;

    return infoPlistProps;
  });
};
