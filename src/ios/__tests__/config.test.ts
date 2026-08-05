import type { ExpoConfig } from "expo/config";

import { withIosInfoPlistDependency } from "../info-plist-dependency";

const config = { name: "test", slug: "test" } as ExpoConfig;

describe("iOS config", () => {
  it.each([undefined, ""])(
    "rejects a missing CodePush server URL",
    (CodePushServerURL) => {
      expect(() =>
        withIosInfoPlistDependency(config, {
          android: {
            CodePushDeploymentKey: "android-key",
            CodePushServerURL: "https://updates.example.com",
          },
          ios: {
            CodePushDeploymentKey: "ios-key",
            CodePushServerURL: CodePushServerURL as string,
          },
        }),
      ).toThrow(/App Center is retired/);
    },
  );

  it("rejects a missing deployment key", () => {
    expect(() =>
      withIosInfoPlistDependency(config, {
        android: {
          CodePushDeploymentKey: "android-key",
          CodePushServerURL: "https://updates.example.com",
        },
        ios: {
          CodePushDeploymentKey: "",
          CodePushServerURL: "https://updates.example.com",
        },
      }),
    ).toThrow(/CodePushDeploymentKey/);
  });
});
