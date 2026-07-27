import type { PluginConfigType } from "../plugin-config";
import type { ConfigPlugin } from "expo/config-plugins";

import { withAppBuildGradle } from "expo/config-plugins";

import { codePushGradlePath } from "../utils/code-push-gradle-path";

/**
 * Appends `apply from: <codepush.gradle>` to the app module's build.gradle.
 *
 * This used to hunt for the `apply from: ... native_modules.gradle` line and
 * insert below it. That line was never the point: it just happened to be the
 * last statement in the RN 0.71-0.73 template. RN 0.75 folded autolinking into
 * `autolinkLibrariesWithApp()` inside the `react { }` block, so by Expo SDK 56
 * there is no `apply from:` in the file at all and the search threw.
 *
 * The end of the file is where the apply has to go regardless of template.
 * `codepush.gradle` reads the `react` extension and iterates
 * `android.buildTypes` while it is being applied, so it has to run after both
 * blocks have been configured. Nothing in it depends on autolinking, so running
 * after that is fine too.
 */
export function applyImplementation(appBuildGradle: string) {
  // Every shape this plugin has ever written names the file, so one check
  // covers projects prebuilt by an older version.
  if (appBuildGradle.includes("codepush.gradle")) {
    return appBuildGradle;
  }

  const codePushImplementation = `apply from: ${codePushGradlePath(
    "android/codepush.gradle",
  )}`;

  return `${appBuildGradle.trimEnd()}\n\n${codePushImplementation}\n`;
}

/**
 * Update `<project>/android/app/build.gradle` by applying the codepush.gradle
 * file, which registers the bundle-hash tasks CodePush needs at build time.
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-nactive-060-version-and-above-android
 */
export const withAndroidBuildscriptDependency: ConfigPlugin<
  PluginConfigType
> = (config) => {
  return withAppBuildGradle(config, (buildGradleProps) => {
    // `apply from:` is Groovy. Expo's template is Groovy, but a project that
    // switched to the Kotlin DSL would get a build file that no longer parses,
    // so say what happened instead of writing it.
    if (buildGradleProps.modResults.language !== "groovy") {
      throw new Error(
        `Cannot apply codepush.gradle: android/app/build.gradle is ${buildGradleProps.modResults.language}, and this plugin only writes the Groovy syntax Expo's template uses.`,
      );
    }

    buildGradleProps.modResults.contents = applyImplementation(
      buildGradleProps.modResults.contents,
    );

    return buildGradleProps;
  });
};
