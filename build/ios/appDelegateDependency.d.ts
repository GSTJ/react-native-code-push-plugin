import { ConfigPlugin } from "expo/config-plugins";
import { PluginConfigType } from "../pluginConfig";
/**
 * Makes the app delegate aware of the CodePush bundle location.
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
export declare const withIosAppDelegateDependency: ConfigPlugin<PluginConfigType>;
