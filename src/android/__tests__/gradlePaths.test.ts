import { applyImplementation } from "../buildscriptDependency";
import { applySettings } from "../settingsDependency";

/** The `apply from:` line shipped by Expo 50's app/build.gradle. */
const appBuildGradle = `
apply plugin: "com.android.application"
apply from: new File(["node", "--print", "require.resolve('@react-native-community/cli-platform-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), "../native_modules.gradle");
`;

const settingsGradle = `rootProject.name = 'app'\n`;

/** Breaks on monorepos, where node_modules is hoisted out of the app folder. */
const hardcodedPath = "node_modules/react-native-code-push";

describe("android gradle paths", () => {
  it("lets node resolve codepush.gradle", () => {
    const result = applyImplementation(appBuildGradle);

    expect(result).toContain(
      "require.resolve('react-native-code-push/package.json')"
    );
    expect(result).toContain('"android/codepush.gradle"');
    expect(result).not.toContain(hardcodedPath);
  });

  it("does not apply codepush.gradle twice", () => {
    const once = applyImplementation(appBuildGradle);

    expect(applyImplementation(once)).toBe(once);
  });

  it("keeps its hands off projects still on the old hardcoded path", () => {
    const legacy = `${appBuildGradle}\napply from: "../../node_modules/react-native-code-push/android/codepush.gradle"`;

    expect(applyImplementation(legacy)).toBe(legacy);
  });

  it("lets node resolve the codepush project dir", () => {
    const result = applySettings(settingsGradle);

    expect(result).toContain("include ':react-native-code-push'");
    expect(result).toContain(
      "require.resolve('react-native-code-push/package.json')"
    );
    expect(result).not.toContain(hardcodedPath);
  });

  it("does not include the codepush project twice", () => {
    const once = applySettings(settingsGradle);

    expect(applySettings(once)).toBe(once);
  });
});
