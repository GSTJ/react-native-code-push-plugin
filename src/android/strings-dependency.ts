import type { PluginConfigType } from "../plugin-config";
import type { ConfigPlugin } from "expo/config-plugins";

import { AndroidConfig, withStringsXml } from "expo/config-plugins";

type ResourceXML = AndroidConfig.Resources.ResourceXML;

/** Helper to add string.xml JSON items or overwrite existing items with the same name. */
const setStrings = (strings: ResourceXML, name: string, value: string) => {
  const xmlProperties = { name, moduleConfig: true };

  return AndroidConfig.Strings.setStringItem(
    [
      // XML represented as JSON
      // <string moduleConfig="true" name="">value</string>
      { $: xmlProperties, _: value },
    ],
    strings,
  );
};

/**
 * Update `<project>/app/src/main/res/values/strings.xml` by adding react-native-code-push deployment key
 */
export const withAndroidStringsDependency: ConfigPlugin<PluginConfigType> = (
  config,
  props,
) => {
  if (!props?.android?.CodePushServerURL) {
    throw new Error(
      "You need to provide the `CodePushServerURL` Android property for react-native-code-push-plugin to work. App Center is retired, so the default server no longer works.",
    );
  }

  if (!props?.android?.CodePushDeploymentKey) {
    throw new Error(
      "You need to provide the `CodePushDeploymentKey` Android property for react-native-code-push-plugin to work.",
    );
  }

  return withStringsXml(config, (xmlProps) => {
    xmlProps.modResults = setStrings(
      xmlProps.modResults,
      "CodePushServerURL",
      props.android.CodePushServerURL,
    );

    xmlProps.modResults = setStrings(
      xmlProps.modResults,
      "CodePushDeploymentKey",
      props.android.CodePushDeploymentKey,
    );

    /** This prop is optional */
    if (props.android.CodePushPublicKey) {
      xmlProps.modResults = setStrings(
        xmlProps.modResults,
        "CodePushPublicKey",
        props.android.CodePushPublicKey,
      );
    }

    return xmlProps;
  });
};
