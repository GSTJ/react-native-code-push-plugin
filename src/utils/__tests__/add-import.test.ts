import { addImport } from "../add-import";

const kotlin = `package com.example

import android.app.Application
import com.facebook.react.ReactApplication

class MainApplication : Application()
`;

describe("addImport", () => {
  it("adds the import below the last one", () => {
    const result = addImport(
      kotlin,
      "com.microsoft.codepush.react.CodePush",
      "kt",
    );

    expect(result).toContain(
      "import com.facebook.react.ReactApplication\nimport com.microsoft.codepush.react.CodePush\n",
    );
  });

  it("terminates Java imports with a semicolon", () => {
    const java = `package com.example;\n\nimport android.app.Application;\n`;

    expect(
      addImport(java, "com.microsoft.codepush.react.CodePush", "java"),
    ).toContain("import com.microsoft.codepush.react.CodePush;");
  });

  it("does not add the same import twice", () => {
    const once = addImport(
      kotlin,
      "com.microsoft.codepush.react.CodePush",
      "kt",
    );

    expect(addImport(once, "com.microsoft.codepush.react.CodePush", "kt")).toBe(
      once,
    );
  });

  it("does not mistake a longer path for the same import", () => {
    const result = addImport(
      kotlin,
      "com.facebook.react.ReactApplicationContext",
      "kt",
    );

    expect(result).toContain(
      "import com.facebook.react.ReactApplicationContext",
    );
    expect(result).toContain("import com.facebook.react.ReactApplication\n");
  });

  it("throws when there is no import block to anchor to", () => {
    expect(() => addImport("package com.example\n", "a.B", "kt")).toThrow(
      /no import statements/,
    );
  });
});
