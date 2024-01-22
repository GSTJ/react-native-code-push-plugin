"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidBuildscriptDependency = void 0;
const config_plugins_1 = require("expo/config-plugins");
const addBelowAnchorIfNotFound_1 = require("../utils/addBelowAnchorIfNotFound");
function applyImplementation(appBuildGradle) {
    const codePushImplementation = 'apply from: "../../node_modules/react-native-code-push/android/codepush.gradle"';
    // Make sure the project does not have the dependency already
    if (appBuildGradle.includes(codePushImplementation)) {
        return appBuildGradle;
    }
    // The default on Expo 50
    const reactNative73Include = `apply from: new File(["node", "--print", "require.resolve('@react-native-community/cli-platform-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), "../native_modules.gradle");`;
    if (appBuildGradle.includes(reactNative73Include)) {
        return (0, addBelowAnchorIfNotFound_1.addBelowAnchorIfNotFound)(appBuildGradle, reactNative73Include, codePushImplementation);
    }
    // Seems to be the default on Expo 49
    const reactNative71Include = `apply from: new File(["node", "--print", "require.resolve('@react-native-community/cli-platform-android/package.json')"].execute(null, rootDir).text.trim(), "../native_modules.gradle");`;
    if (appBuildGradle.includes(reactNative71Include)) {
        return (0, addBelowAnchorIfNotFound_1.addBelowAnchorIfNotFound)(appBuildGradle, reactNative71Include, codePushImplementation);
    }
    // For compatibility
    const reactNativeFileClassGradleInclude = `'apply from: new File(reactNativeRoot, "react.gradle")`;
    if (appBuildGradle.includes(reactNativeFileClassGradleInclude)) {
        return (0, addBelowAnchorIfNotFound_1.addBelowAnchorIfNotFound)(appBuildGradle, reactNativeFileClassGradleInclude, codePushImplementation);
    }
    // For compatibility
    const reactNativeRawGradleInclude = `apply from: "../../node_modules/react-native/react.gradle"`;
    if (appBuildGradle.includes(reactNativeRawGradleInclude)) {
        return (0, addBelowAnchorIfNotFound_1.addBelowAnchorIfNotFound)(appBuildGradle, reactNativeRawGradleInclude, codePushImplementation);
    }
    throw new Error("Cannot find a suitable place to insert the CodePush buildscript dependency.");
}
/**
 * Update `<project>/build.gradle` by adding the codepush.gradle file
 * as an additional build task definition underneath react.gradle
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-nactive-060-version-and-above-android
 */
const withAndroidBuildscriptDependency = (config) => {
    return (0, config_plugins_1.withAppBuildGradle)(config, (buildGradleProps) => {
        buildGradleProps.modResults.contents = applyImplementation(buildGradleProps.modResults.contents);
        return buildGradleProps;
    });
};
exports.withAndroidBuildscriptDependency = withAndroidBuildscriptDependency;
//# sourceMappingURL=buildscriptDependency.js.map