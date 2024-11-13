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
  let CodePushServerURL: string = 'https://codepush.appcenter.ms/';

  if (props?.ios?.CodePushServerURL) {
    CodePushServerURL = props?.ios?.CodePushServerURL;
  }

  if (!props?.ios?.CodePushDeploymentKey) {
    throw new Error(
        "You need to provide the `CodePushDeploymentKey` IOS property for the @config-plugins/react-native-code-push plugin to work."
    );
  }

  return withInfoPlist(config, (infoPlistProps) => {
    infoPlistProps.modResults.CodePushServerURL =
        CodePushServerURL;

    infoPlistProps.modResults.CodePushDeploymentKey =
      props.ios.CodePushDeploymentKey;

    return infoPlistProps;
  });
};
