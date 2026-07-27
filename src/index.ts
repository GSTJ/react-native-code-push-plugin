import type { PluginConfigType } from "./plugin-config";
import type { ConfigPlugin } from "expo/config-plugins";

import { createRunOncePlugin } from "expo/config-plugins";

import { withAndroidBuildscriptDependency } from "./android/buildscript-dependency";
import { withAndroidMainApplicationDependency } from "./android/main-application-dependency";
import { withAndroidSettingsDependency } from "./android/settings-dependency";
import { withAndroidStringsDependency } from "./android/strings-dependency";
import { withIosAppDelegateDependency } from "./ios/app-delegate-dependency";
import { withIosInfoPlistDependency } from "./ios/info-plist-dependency";

// @todo: Is this still needed?
let pkg: { name: string; version?: string } = {
  name: "react-native-code-push",
};
try {
  pkg = require("react-native-code-push/package.json");
} catch {
  // empty catch block
}

/**
 * A config plugin for configuring `react-native-code-push`
 */
const withRnCodepush: ConfigPlugin<PluginConfigType> = (config, props) => {
  // Plugins order matter, be careful when changing the order.

  // Apply Android changes
  config = withAndroidBuildscriptDependency(config, props);
  config = withAndroidSettingsDependency(config, props);
  config = withAndroidStringsDependency(config, props);
  config = withAndroidMainApplicationDependency(config, props);

  // Apply iOS changes
  config = withIosInfoPlistDependency(config, props);
  config = withIosAppDelegateDependency(config, props);

  return config;
};

export default createRunOncePlugin(withRnCodepush, pkg.name, pkg.version);
