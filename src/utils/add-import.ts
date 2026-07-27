const escapeForRegExp = (value: string) =>
  value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/**
 * Adds an import to a Java or Kotlin source file, below the last import already
 * there.
 *
 * The mods used to hang this off `import expo.modules.ReactNativeHostWrapper`,
 * which prebuild stopped emitting once `MainApplication` moved to `ReactHost`.
 * Every import block ends somewhere, so anchoring on the block itself survives
 * the templates shuffling their imports around.
 *
 * @param source The file contents.
 * @param importPath The class to import, e.g. `com.microsoft.codepush.react.CodePush`.
 * @param language `java` needs the trailing semicolon, `kt` does not.
 * @returns The source with the import added, or unchanged if it was already there.
 */
export function addImport(
  source: string,
  importPath: string,
  language: "java" | "kt",
) {
  const statement =
    language === "java" ? `import ${importPath};` : `import ${importPath}`;

  const lines = source.split("\n");

  // Static imports and Kotlin aliases both start the same way, so matching the
  // path with a word boundary is enough to spot a duplicate.
  const alreadyImported = lines.some((line) =>
    new RegExp(
      `^\\s*import\\s+(static\\s+)?${escapeForRegExp(importPath)}\\b`,
    ).test(line),
  );
  if (alreadyImported) return source;

  let lastImport = -1;
  for (let index = lines.length - 1; index >= 0; index--) {
    if (/^\s*import\s+\S/.test(lines[index] ?? "")) {
      lastImport = index;
      break;
    }
  }

  if (lastImport === -1) {
    throw new Error(
      `Cannot add "${statement}": the file has no import statements to add it below.`,
    );
  }

  lines.splice(lastImport + 1, 0, statement);
  return lines.join("\n");
}
