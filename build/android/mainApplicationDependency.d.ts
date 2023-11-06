import { ConfigPlugin } from "expo/config-plugins";
import { PluginConfigType } from "../pluginConfig";
/**
 * Updates the `MainApplication.java` by adding the CodePush runtime initialization code
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android
 */
export declare const withAndroidMainApplicationDependency: ConfigPlugin<PluginConfigType>;
