import { ConfigPlugin } from "expo/config-plugins";
import { PluginConfigType } from "../pluginConfig";
/**
 * Sets the CodePushServerURL and CodePushDeploymentKey in the iOS Info.plist
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
export declare const withIosInfoPlistDependency: ConfigPlugin<PluginConfigType>;
