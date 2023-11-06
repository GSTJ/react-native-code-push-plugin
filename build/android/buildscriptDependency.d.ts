import { ConfigPlugin } from "expo/config-plugins";
import { PluginConfigType } from "../pluginConfig";
/**
 * Update `<project>/build.gradle` by adding the codepush.gradle file
 * as an additional build task definition underneath react.gradle
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-nactive-060-version-and-above-android
 */
export declare const withAndroidBuildscriptDependency: ConfigPlugin<PluginConfigType>;
