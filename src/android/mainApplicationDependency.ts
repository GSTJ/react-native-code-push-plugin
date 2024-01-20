import { ConfigPlugin, withMainApplication } from "expo/config-plugins";

import { PluginConfigType } from "../pluginConfig";
import { addBelowAnchorIfNotFound } from "../utils/addBelowAnchorIfNotFound";

/**
 * Updates the `MainApplication.java` by adding the CodePush runtime initialization code
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android
 */
export const withAndroidMainApplicationDependency: ConfigPlugin<
  PluginConfigType
> = (config) => {
  return withMainApplication(config, (mainApplicationProps) => {
    // Import the plugin class.
    mainApplicationProps.modResults.contents = addBelowAnchorIfNotFound(
      mainApplicationProps.modResults.contents,
      "import expo.modules.ReactNativeHostWrapper;",
      "import com.microsoft.codepush.react.CodePush;"
    );

    // The default on Expo 50, which uses kotlin
    const kotlinAnchor = `override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"`;
    if (mainApplicationProps.modResults.contents.includes(kotlinAnchor)) {
      /**
       * Override the getJSBundleFile method in order to let
       * the CodePush runtime determine where to get the JS
       * bundle location from on each app start
       */
      const kotlinJSBundleFileOverride = `
      override fun getJSBundleFile(): String? {
        return CodePush.getJSBundleFile()
      }
      `;
      mainApplicationProps.modResults.contents = addBelowAnchorIfNotFound(
        mainApplicationProps.modResults.contents,
        kotlinAnchor,
        kotlinJSBundleFileOverride
      );
    }

    /**
     * Override the getJSBundleFile method in order to let
     * the CodePush runtime determine where to get the JS
     * bundle location from on each app start
     */
    const getJSBundleFileOverride = `
      @Override
      protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
      }\n`;

    // The default on Expo 49
    const defaultReactNativeAnchor = "new DefaultReactNativeHost(this) {";
    if (
      mainApplicationProps.modResults.contents.includes(
        defaultReactNativeAnchor
      )
    ) {
      mainApplicationProps.modResults.contents = addBelowAnchorIfNotFound(
        mainApplicationProps.modResults.contents,
        defaultReactNativeAnchor,
        getJSBundleFileOverride
      );

      return mainApplicationProps;
    }

    // This is for compatibility, as it follows the Codepush instructions up-to-spec.
    const reactNativeHostAnchor = "new ReactNativeHost(this) {";
    if (
      mainApplicationProps.modResults.contents.includes(reactNativeHostAnchor)
    ) {
      mainApplicationProps.modResults.contents = addBelowAnchorIfNotFound(
        mainApplicationProps.modResults.contents,
        reactNativeHostAnchor,
        getJSBundleFileOverride
      );

      return mainApplicationProps;
    }

    throw new Error(
      "Cannot find a suitable place to insert the CodePush getJSBundleFile code."
    );
  });
};
