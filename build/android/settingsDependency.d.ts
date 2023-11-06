import { ConfigPlugin } from "expo/config-plugins";
import { PluginConfigType } from "../pluginConfig";
/**
 * Update `<project>/settings.gradle` by adding react-native-code-push
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android
 */
export declare const withAndroidSettingsDependency: ConfigPlugin<PluginConfigType>;
