"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withIosInfoPlistDependency = void 0;
const config_plugins_1 = require("expo/config-plugins");
/**
 * Sets the CodePushDeploymentKey in the iOS Info.plist
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
const withIosInfoPlistDependency = (config, props) => {
    if (!props?.ios?.CodePushDeploymentKey) {
        throw new Error("You need to provide the `CodePushDeploymentKey` IOS property for the @config-plugins/react-native-code-push plugin to work.");
    }
    return (0, config_plugins_1.withInfoPlist)(config, (infoPlistProps) => {
        infoPlistProps.modResults.CodePushDeploymentKey =
            props.ios.CodePushDeploymentKey;
        return infoPlistProps;
    });
};
exports.withIosInfoPlistDependency = withIosInfoPlistDependency;
//# sourceMappingURL=infoPlistDependency.js.map