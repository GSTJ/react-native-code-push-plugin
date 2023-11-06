"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const buildscriptDependency_1 = require("./android/buildscriptDependency");
const mainApplicationDependency_1 = require("./android/mainApplicationDependency");
const settingsDependency_1 = require("./android/settingsDependency");
const stringsDependency_1 = require("./android/stringsDependency");
const appDelegateDependency_1 = require("./ios/appDelegateDependency");
const infoPlistDependency_1 = require("./ios/infoPlistDependency");
// @todo: Is this still needed?
let pkg = {
    name: "react-native-code-push",
};
try {
    pkg = require("react-native-code-push/package.json");
}
catch {
    // empty catch block
}
/**
 * A config plugin for configuring `react-native-code-push`
 */
const withRnCodepush = (config, props) => {
    // Plugins order matter, be careful when changing the order.
    // Apply Android changes
    config = (0, buildscriptDependency_1.withAndroidBuildscriptDependency)(config, props);
    config = (0, settingsDependency_1.withAndroidSettingsDependency)(config, props);
    config = (0, stringsDependency_1.withAndroidStringsDependency)(config, props);
    config = (0, mainApplicationDependency_1.withAndroidMainApplicationDependency)(config, props);
    // Apply iOS changes
    config = (0, infoPlistDependency_1.withIosInfoPlistDependency)(config, props);
    config = (0, appDelegateDependency_1.withIosAppDelegateDependency)(config, props);
    return config;
};
exports.default = (0, config_plugins_1.createRunOncePlugin)(withRnCodepush, pkg.name, pkg.version);
//# sourceMappingURL=index.js.map