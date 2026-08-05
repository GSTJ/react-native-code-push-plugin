/**
 * Secrets for `react-native-code-push`
 */
export type PluginConfigType = {
  ios: {
    CodePushServerURL: string;
    CodePushDeploymentKey: string;
  };
  android: {
    CodePushServerURL: string;
    CodePushDeploymentKey: string;
    CodePushPublicKey?: string;
  };
};
