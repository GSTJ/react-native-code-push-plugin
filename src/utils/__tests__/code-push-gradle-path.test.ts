import { codePushGradlePath } from "../code-push-gradle-path";

describe("codePushGradlePath", () => {
  it("builds the full gradle expression", () => {
    expect(codePushGradlePath("android/codepush.gradle")).toBe(
      `new File(new File(["node", "--print", "require.resolve('react-native-code-push/package.json')"].execute(null, rootDir).text.trim()).parentFile, "android/codepush.gradle")`,
    );
  });

  it("embeds the given relative path", () => {
    expect(codePushGradlePath("android")).toContain('"android"');
  });

  it("resolves the package through node instead of a hardcoded path", () => {
    expect(codePushGradlePath("android/codepush.gradle")).toContain(
      "require.resolve('react-native-code-push/package.json')",
    );
    expect(codePushGradlePath("android/codepush.gradle")).not.toContain(
      "../../node_modules",
    );
  });

  it("points different files at different paths", () => {
    expect(codePushGradlePath("android/codepush.gradle")).not.toBe(
      codePushGradlePath("android"),
    );
  });
});
