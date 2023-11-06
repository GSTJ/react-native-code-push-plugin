"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withIosAppDelegateDependency = void 0;
const config_plugins_1 = require("expo/config-plugins");
const addBelowAnchorIfNotFound_1 = require("../utils/addBelowAnchorIfNotFound");
const replaceIfNotFound_1 = require("../utils/replaceIfNotFound");
/**
 * Makes the app delegate aware of the CodePush bundle location.
 * https://github.com/microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
const withIosAppDelegateDependency = (config, _props) => {
    return (0, config_plugins_1.withAppDelegate)(config, (appDelegateProps) => {
        appDelegateProps.modResults.contents = (0, addBelowAnchorIfNotFound_1.addBelowAnchorIfNotFound)(appDelegateProps.modResults.contents, `#import "AppDelegate.h"`, `#import <CodePush/CodePush.h>`);
        appDelegateProps.modResults.contents = (0, replaceIfNotFound_1.replaceIfNotFound)(appDelegateProps.modResults.contents, `return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`, `return [CodePush bundleURL];`);
        return appDelegateProps;
    });
};
exports.withIosAppDelegateDependency = withIosAppDelegateDependency;
//# sourceMappingURL=appDelegateDependency.js.map