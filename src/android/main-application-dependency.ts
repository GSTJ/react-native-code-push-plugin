import type { PluginConfigType } from "../plugin-config";
import type { ConfigPlugin } from "expo/config-plugins";

import { withMainApplication } from "expo/config-plugins";

import { addBelowAnchorIfNotFound } from "../utils/add-below-anchor-if-not-found";
import { addImport } from "../utils/add-import";
import { insertLastArgument } from "../utils/insert-last-argument";

type Language = "java" | "kt";

const CODE_PUSH_CLASS = "com.microsoft.codepush.react.CodePush";

/** Once this reads back, the file has already been through here. */
const CODE_PUSH_BUNDLE_CALL = "CodePush.getJSBundleFile()";

/**
 * Expo SDK 56 dropped `ReactNativeHost` from the template. `MainApplication`
 * now builds a `ReactHost` through this factory, which takes the bundle path as
 * an argument instead of exposing a method to override.
 */
const REACT_HOST_FACTORY = "ExpoReactHostFactory.getDefaultReactHost";

/**
 * Points the React runtime at the bundle CodePush picked: the update it
 * downloaded, or the one baked into the APK when there is nothing newer.
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android
 */
export function applyMainApplication(contents: string, language: Language) {
  if (contents.includes(CODE_PUSH_BUNDLE_CALL)) return contents;

  const withImport = addImport(contents, CODE_PUSH_CLASS, language);

  // Expo SDK 56 and up. The argument has to be appended rather than slotted in
  // anywhere: Kotlin evaluates arguments in source order, and
  // `CodePush.getJSBundleFile()` throws until a `CodePush` instance exists,
  // which the `packageList` argument above it is what creates.
  const reactHost = insertLastArgument(
    withImport,
    REACT_HOST_FACTORY,
    `jsBundleFilePath = ${CODE_PUSH_BUNDLE_CALL}`,
  );
  if (reactHost !== null) return reactHost;

  // Expo SDK 49 through 55, and anything else still on `ReactNativeHost`. Both
  // languages share the anchor: Kotlin writes
  // `object : DefaultReactNativeHost(this) {`, Java writes
  // `new DefaultReactNativeHost(this) {`.
  const override =
    language === "kt"
      ? `
          override fun getJSBundleFile(): String? = ${CODE_PUSH_BUNDLE_CALL}
`
      : `
      @Override
      protected String getJSBundleFile() {
        return ${CODE_PUSH_BUNDLE_CALL};
      }
`;

  for (const anchor of [
    "DefaultReactNativeHost(this) {",
    "ReactNativeHost(this) {",
  ]) {
    if (withImport.includes(anchor)) {
      return addBelowAnchorIfNotFound(withImport, anchor, override);
    }
  }

  throw new Error(
    `Cannot find a suitable place to insert the CodePush getJSBundleFile code. MainApplication has neither a "${REACT_HOST_FACTORY}" call nor a "ReactNativeHost" subclass to hook into.`,
  );
}

/**
 * Updates `MainApplication` so the CodePush runtime decides where the JS bundle
 * comes from on each app start.
 */
export const withAndroidMainApplicationDependency: ConfigPlugin<
  PluginConfigType
> = (config) => {
  return withMainApplication(config, (mainApplicationProps) => {
    mainApplicationProps.modResults.contents = applyMainApplication(
      mainApplicationProps.modResults.contents,
      mainApplicationProps.modResults.language,
    );

    return mainApplicationProps;
  });
};
