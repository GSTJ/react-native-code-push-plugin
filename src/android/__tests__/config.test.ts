import type { ExpoConfig } from "expo/config";

import { withAndroidStringsDependency } from "../strings-dependency";

const config = { name: "test", slug: "test" } as ExpoConfig;

describe("Android config", () => {
  it.each([undefined, ""])(
    "rejects a missing CodePush server URL",
    (CodePushServerURL) => {
      expect(() =>
        withAndroidStringsDependency(config, {
          android: {
            CodePushDeploymentKey: "android-key",
            CodePushServerURL: CodePushServerURL as string,
          },
          ios: {
            CodePushDeploymentKey: "ios-key",
            CodePushServerURL: "https://updates.example.com",
          },
        }),
      ).toThrow(/App Center is retired/);
    },
  );

  it("rejects a missing deployment key", () => {
    expect(() =>
      withAndroidStringsDependency(config, {
        android: {
          CodePushDeploymentKey: "",
          CodePushServerURL: "https://updates.example.com",
        },
        ios: {
          CodePushDeploymentKey: "ios-key",
          CodePushServerURL: "https://updates.example.com",
        },
      }),
    ).toThrow(/CodePushDeploymentKey/);
  });
});
