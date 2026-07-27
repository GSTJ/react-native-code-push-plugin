import { applyAppDelegate } from "../app-delegate-dependency";
import {
  applyBridgingHeader,
  findBridgingHeaderPath,
} from "../bridging-header-dependency";
import {
  bridgingHeader,
  sdk50AppDelegate,
  sdk52AppDelegate,
  sdk53AppDelegate,
  sdk57AppDelegate,
} from "./templates";

const swiftTemplates = [
  ["SDK 53", sdk53AppDelegate],
  ["SDK 57", sdk57AppDelegate],
] as const;

const objcTemplates = [
  ["SDK 50", sdk50AppDelegate],
  ["SDK 52", sdk52AppDelegate],
] as const;

describe("AppDelegate.swift", () => {
  it.each(swiftTemplates)("redirects the release bundle on %s", (_, source) => {
    expect(source).toContain(
      'Bundle.main.url(forResource: "main", withExtension: "jsbundle")',
    );

    const result = applyAppDelegate(source, "swift");

    expect(result).toContain("return CodePush.bundleURL()");
    expect(result).not.toContain('Bundle.main.url(forResource: "main"');
  });

  it.each(swiftTemplates)(
    "leaves the Metro branch on %s alone",
    (_, source) => {
      const result = applyAppDelegate(source, "swift");

      expect(result).toContain(
        'RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")',
      );
      expect(result).toContain("#if DEBUG");
    },
  );

  it("changes nothing but that one expression", () => {
    const result = applyAppDelegate(sdk57AppDelegate, "swift");

    expect(result).toBe(
      sdk57AppDelegate.replace(
        'Bundle.main.url(forResource: "main", withExtension: "jsbundle")',
        "CodePush.bundleURL()",
      ),
    );
  });

  it("adds no import, because the bridging header carries it", () => {
    const result = applyAppDelegate(sdk57AppDelegate, "swift");

    expect(result).not.toContain("#import");
    expect(result).not.toContain("import CodePush");
  });

  it.each(swiftTemplates)("is idempotent on %s", (_, source) => {
    const once = applyAppDelegate(source, "swift");

    expect(applyAppDelegate(once, "swift")).toBe(once);
  });

  it("tolerates the call being reflowed across lines", () => {
    const reflowed = sdk57AppDelegate.replace(
      'Bundle.main.url(forResource: "main", withExtension: "jsbundle")',
      'Bundle.main.url(\n      forResource: "main",\n      withExtension: "jsbundle"\n    )',
    );

    expect(applyAppDelegate(reflowed, "swift")).toContain(
      "return CodePush.bundleURL()",
    );
  });

  it("throws instead of quietly doing nothing", () => {
    const customised = sdk57AppDelegate.replace(
      'Bundle.main.url(forResource: "main", withExtension: "jsbundle")',
      "myOwnBundleURL()",
    );

    expect(() => applyAppDelegate(customised, "swift")).toThrow(
      /no `Bundle\.main\.url/,
    );
  });

  it("says what to do when it throws", () => {
    expect(() => applyAppDelegate("class AppDelegate {}", "swift")).toThrow(
      /CodePush\.bundleURL\(\)/,
    );
  });
});

describe("AppDelegate.mm", () => {
  it.each(objcTemplates)("redirects the release bundle on %s", (_, source) => {
    const result = applyAppDelegate(source, "objcpp");

    expect(result).toContain("return [CodePush bundleURL];");
    expect(result).toContain("#import <CodePush/CodePush.h>");
    expect(result).not.toContain('URLForResource:@"main"');
  });

  it.each(objcTemplates)("leaves the Metro branch on %s alone", (_, source) => {
    const result = applyAppDelegate(source, "objcpp");

    expect(result).toContain(
      '[[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"]',
    );
  });

  it("puts the import below the AppDelegate header", () => {
    const result = applyAppDelegate(sdk52AppDelegate, "objcpp");

    expect(result).toContain(
      '#import "AppDelegate.h"\n#import <CodePush/CodePush.h>',
    );
  });

  it.each(objcTemplates)("is idempotent on %s", (_, source) => {
    const once = applyAppDelegate(source, "objcpp");

    expect(applyAppDelegate(once, "objcpp")).toBe(once);
  });

  it("throws when the bundle line is gone", () => {
    const customised = sdk52AppDelegate.replace(
      '[[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"]',
      "[self myOwnBundleURL]",
    );

    expect(() => applyAppDelegate(customised, "objcpp")).toThrow(
      /NSBundle mainBundle/,
    );
  });

  it("throws when the import anchor is gone", () => {
    const customised = sdk52AppDelegate.replace(
      '#import "AppDelegate.h"',
      '#import "MyAppDelegate.h"',
    );

    expect(() => applyAppDelegate(customised, "objcpp")).toThrow(
      /anchor string/,
    );
  });
});

describe("bridging header", () => {
  it("adds the CodePush import to Expo's empty header", () => {
    const result = applyBridgingHeader(bridgingHeader);

    expect(result).toContain("#import <CodePush/CodePush.h>");
    expect(result.startsWith(bridgingHeader.trimEnd())).toBe(true);
  });

  it("does not add it twice", () => {
    const once = applyBridgingHeader(bridgingHeader);

    expect(applyBridgingHeader(once)).toBe(once);
  });

  it("keeps imports a project already had", () => {
    const existing = `${bridgingHeader}\n#import <Something/Else.h>\n`;

    expect(applyBridgingHeader(existing)).toContain(
      "#import <Something/Else.h>",
    );
  });

  it("reads the header path out of the Xcode project", () => {
    const pbxproj = `
\t\t\t\tSWIFT_OBJC_BRIDGING_HEADER = "sdk57app/sdk57app-Bridging-Header.h";
\t\t\t\tSWIFT_VERSION = 5.0;
`;

    expect(findBridgingHeaderPath(pbxproj)).toBe(
      "sdk57app/sdk57app-Bridging-Header.h",
    );
  });

  it("reads an unquoted header path", () => {
    expect(
      findBridgingHeaderPath("SWIFT_OBJC_BRIDGING_HEADER = Bridging-Header.h;"),
    ).toBe("Bridging-Header.h");
  });

  it("throws when the project has no bridging header", () => {
    expect(() => findBridgingHeaderPath("SWIFT_VERSION = 5.0;")).toThrow(
      /SWIFT_OBJC_BRIDGING_HEADER/,
    );
  });
});
