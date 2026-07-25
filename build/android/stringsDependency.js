"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidStringsDependency = void 0;
const config_plugins_1 = require("expo/config-plugins");
/** Helper to add string.xml JSON items or overwrite existing items with the same name. */
function setStrings(strings, name, value) {
    const xmlProperties = { name, moduleConfig: true };
    return config_plugins_1.AndroidConfig.Strings.setStringItem([
        // XML represented as JSON
        // <string moduleConfig="true" name="">value</string>
        { $: xmlProperties, _: value },
    ], strings);
}
/**
 * Update `<project>/app/src/main/res/values/strings.xml` by adding react-native-code-push deployment key
 */
const withAndroidStringsDependency = (config, props) => {
    // if (!props?.android?.CodePushServerURL) {
    //   throw new Error(
    //       "You need to provide the `CodePushServerURL` Android property for the @config-plugins/react-native-code-push plugin to work."
    //   );
    // }
    if (!props?.android?.CodePushDeploymentKey) {
        throw new Error("You need to provide the `CodePushDeploymentKey` Android property for the @config-plugins/react-native-code-push plugin to work.");
    }
    return (0, config_plugins_1.withStringsXml)(config, (xmlProps) => {
        if (props?.android?.CodePushServerURL) {
            xmlProps.modResults = setStrings(xmlProps.modResults, "CodePushServerURL", props?.android?.CodePushServerURL);
        }
        xmlProps.modResults = setStrings(xmlProps.modResults, "CodePushDeploymentKey", props.android.CodePushDeploymentKey);
        /** This prop is optional */
        if (props.android.CodePushPublicKey) {
            xmlProps.modResults = setStrings(xmlProps.modResults, "CodePushPublicKey", props.android.CodePushPublicKey);
        }
        return xmlProps;
    });
};
exports.withAndroidStringsDependency = withAndroidStringsDependency;
//# sourceMappingURL=stringsDependency.js.map