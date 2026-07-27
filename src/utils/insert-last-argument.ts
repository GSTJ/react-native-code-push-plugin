/** What sits at a given index while scanning a call's argument list. */
type Scanned =
  /** A comment or string literal whose last character is at `end`. */
  | { end: number; isLiteral: boolean }
  /** A comment or literal that never closes, so the source cannot be read. */
  | "unterminated"
  /** Anything else: a character that counts as code. */
  | "code";

/**
 * Classifies the token starting at `index`, so the scanner below can step over
 * the parentheses that live inside comments and strings. Covers what prebuild
 * emits in Java and Kotlin: `//` and block comments, `"` strings with escapes,
 * Kotlin's `"""` raw strings, and Java char literals.
 */
const scanAt = (source: string, index: number): Scanned => {
  const character = source[index] ?? "";
  const next = source[index + 1];

  if (character === "/" && next === "/") {
    const lineEnd = source.indexOf("\n", index);
    return lineEnd === -1 ? "unterminated" : { end: lineEnd, isLiteral: false };
  }

  if (character === "/" && next === "*") {
    const commentEnd = source.indexOf("*/", index + 2);
    return commentEnd === -1
      ? "unterminated"
      : { end: commentEnd + 1, isLiteral: false };
  }

  if (source.startsWith('"""', index)) {
    const rawEnd = source.indexOf('"""', index + 3);
    return rawEnd === -1
      ? "unterminated"
      : { end: rawEnd + 2, isLiteral: true };
  }

  if (character === '"' || character === "'") {
    let cursor = index + 1;
    while (cursor < source.length && source[cursor] !== character) {
      // A backslash escapes whatever follows it, including the quote.
      cursor += source[cursor] === "\\" ? 2 : 1;
    }
    return cursor >= source.length
      ? "unterminated"
      : { end: cursor, isLiteral: true };
  }

  return "code";
};

type CallBounds = {
  /** Index of the `)` that closes the call. */
  closeIndex: number;
  /**
   * Index just past the last character of code inside the call, so trailing
   * whitespace and comments are excluded. A comma appended here cannot land
   * inside a `//` comment, where it would be silently commented out.
   */
  endOfArguments: number;
};

/** Walks from a call's opening parenthesis to its match. */
const findCallBounds = (
  source: string,
  openIndex: number,
): CallBounds | null => {
  let depth = 0;
  let endOfArguments = openIndex + 1;

  for (let index = openIndex; index < source.length; index++) {
    const scanned = scanAt(source, index);

    if (scanned === "unterminated") return null;

    if (scanned === "code") {
      const character = source[index] ?? "";

      if (character === "(") depth++;
      if (character === ")") depth--;

      // The scan starts on the call's own `(`, so depth is 1 from the first
      // character on and only the matching `)` can bring it back to 0.
      if (depth === 0) return { closeIndex: index, endOfArguments };

      if (!/\s/.test(character)) endOfArguments = index + 1;
    } else {
      // A string is part of an argument; a comment is not.
      if (scanned.isLiteral) endOfArguments = scanned.end + 1;
      index = scanned.end;
    }
  }

  return null;
};

/**
 * Appends an argument to a call, leaving the closing parenthesis where it is.
 *
 * Position is not cosmetic. Kotlin evaluates arguments in the order they are
 * written, and `CodePush.getJSBundleFile()` throws until a `CodePush` instance
 * exists, which only happens once `PackageList(this).packages` has been built.
 * Appending is the only placement that holds regardless of how many arguments
 * the template passes or how they are laid out.
 *
 * @param source The file contents.
 * @param callee The call to extend, without its parenthesis, e.g.
 *   `ExpoReactHostFactory.getDefaultReactHost`.
 * @param argument The argument to append, e.g. `jsBundleFilePath = null`.
 * @returns The source with the argument appended, or `null` if the call is not
 *   there or its parentheses never balance.
 */
export function insertLastArgument(
  source: string,
  callee: string,
  argument: string,
) {
  const calleeIndex = source.indexOf(`${callee}(`);
  if (calleeIndex === -1) return null;

  const openIndex = calleeIndex + callee.length;
  const bounds = findCallBounds(source, openIndex);
  if (bounds === null) return null;

  const { closeIndex, endOfArguments } = bounds;

  // An empty argument list has no trailing comma to add and nothing to line the
  // argument up with, so write it straight between the parentheses.
  if (source.slice(openIndex + 1, closeIndex).trim() === "") {
    return `${source.slice(0, openIndex + 1)}${argument}${source.slice(closeIndex)}`;
  }

  // Indent one level past the closing parenthesis when it sits on its own line,
  // otherwise past the line the call opens on.
  const lineStart = source.lastIndexOf("\n", closeIndex - 1) + 1;
  const closeIndent = /^[\t ]*/.exec(source.slice(lineStart, closeIndex))?.[0];
  const indent = `${closeIndent ?? ""}  `;

  return `${source.slice(0, endOfArguments)},\n${indent}${argument}${source.slice(endOfArguments)}`;
}
