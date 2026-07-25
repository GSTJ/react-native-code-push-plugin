"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidSettingsDependency = exports.applySettings = void 0;
const config_plugins_1 = require("expo/config-plugins");
const codePushGradlePath_1 = require("../utils/codePushGradlePath");
function applySettings(gradleSettings) {
    const includeCodePush = "include ':react-native-code-push'";
    // Make sure the project does not have the settings already
    if (gradleSettings.includes(includeCodePush)) {
        return gradleSettings;
    }
    const codePushSettings = `
${includeCodePush}
project(':react-native-code-push').projectDir = ${(0, codePushGradlePath_1.codePushGradlePath)("android/app")}`;
    return gradleSettings + codePushSettings;
}
exports.applySettings = applySettings;
/**
 * Update `<project>/settings.gradle` by adding react-native-code-push
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-android.md#plugin-installation-and-configuration-for-react-native-060-version-and-above-android
 */
const withAndroidSettingsDependency = (config) => {
    return (0, config_plugins_1.withSettingsGradle)(config, (gradleProps) => {
        gradleProps.modResults.contents = applySettings(gradleProps.modResults.contents);
        return gradleProps;
    });
};
exports.withAndroidSettingsDependency = withAndroidSettingsDependency;
//# sourceMappingURL=settingsDependency.js.map