import { applyImplementation } from "../buildscript-dependency";
import { applyMainApplication } from "../main-application-dependency";
import {
  sdk49MainApplication,
  sdk50AppBuildGradle,
  sdk50MainApplication,
  sdk57AppBuildGradle,
  sdk57MainApplication,
} from "./templates";

describe("app/build.gradle", () => {
  it("applies codepush.gradle on SDK 57, where no `apply from:` is left", () => {
    expect(sdk57AppBuildGradle).not.toContain("apply from:");

    const result = applyImplementation(sdk57AppBuildGradle);

    expect(result).toContain("apply from:");
    expect(result).toContain('"android/codepush.gradle"');
  });

  it("applies codepush.gradle last, after `android` and `react` are configured", () => {
    for (const template of [sdk50AppBuildGradle, sdk57AppBuildGradle]) {
      const result = applyImplementation(template);

      expect(result.trimEnd().split("\n").at(-1)).toContain(
        "android/codepush.gradle",
      );
      // codepush.gradle iterates `android.buildTypes` as it is applied.
      expect(result.indexOf("codepush.gradle")).toBeGreaterThan(
        result.indexOf("android {"),
      );
    }
  });

  it("leaves everything above it alone", () => {
    const result = applyImplementation(sdk57AppBuildGradle);

    expect(result.startsWith(sdk57AppBuildGradle.trimEnd())).toBe(true);
  });

  it("is idempotent on both templates", () => {
    for (const template of [sdk50AppBuildGradle, sdk57AppBuildGradle]) {
      const once = applyImplementation(template);

      expect(applyImplementation(once)).toBe(once);
    }
  });
});

describe("MainApplication", () => {
  it("passes the CodePush bundle to the SDK 57 ReactHost factory", () => {
    const result = applyMainApplication(sdk57MainApplication, "kt");

    expect(result).toContain("import com.microsoft.codepush.react.CodePush");
    expect(result).toContain("jsBundleFilePath = CodePush.getJSBundleFile()");
    // Kotlin evaluates arguments in order, and getJSBundleFile() throws until
    // PackageList has constructed the CodePush instance.
    expect(result.indexOf("jsBundleFilePath")).toBeGreaterThan(
      result.indexOf("PackageList(this).packages"),
    );
  });

  it("closes the SDK 57 factory call where it found it", () => {
    const result = applyMainApplication(sdk57MainApplication, "kt");

    // The commented-out `add(MyReactNativePackage())` sits between the opening
    // parenthesis and the closing one, so a naive search finds the wrong `)`.
    expect(
      result.slice(
        result.indexOf("    ExpoReactHostFactory"),
        result.indexOf("\n  }\n"),
      ),
    ).toBe(`    ExpoReactHostFactory.getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
      jsBundleFilePath = CodePush.getJSBundleFile()
    )`);
  });

  it("still overrides getJSBundleFile on the Kotlin ReactNativeHost template", () => {
    const result = applyMainApplication(sdk50MainApplication, "kt");

    expect(result).toContain("import com.microsoft.codepush.react.CodePush");
    expect(result).toContain(
      "override fun getJSBundleFile(): String? = CodePush.getJSBundleFile()",
    );
    expect(result).not.toContain("jsBundleFilePath");
  });

  it("still overrides getJSBundleFile on the Java template, semicolons included", () => {
    const result = applyMainApplication(sdk49MainApplication, "java");

    expect(result).toContain("import com.microsoft.codepush.react.CodePush;");
    expect(result).toContain("return CodePush.getJSBundleFile();");
    expect(result).toContain("@Override");
  });

  it("is idempotent on every template", () => {
    const cases = [
      [sdk57MainApplication, "kt"],
      [sdk50MainApplication, "kt"],
      [sdk49MainApplication, "java"],
    ] as const;

    for (const [template, language] of cases) {
      const once = applyMainApplication(template, language);

      expect(applyMainApplication(once, language)).toBe(once);
    }
  });

  it("says what it looked for when the template has neither hook", () => {
    const unknown = `package com.example\n\nimport android.app.Application\n\nclass MainApplication : Application()\n`;

    expect(() => applyMainApplication(unknown, "kt")).toThrow(
      /ExpoReactHostFactory\.getDefaultReactHost/,
    );
  });
});
