import { insertLastArgument } from "../insert-last-argument";

describe("insertLastArgument", () => {
  it("appends to a single-line call", () => {
    expect(insertLastArgument(`foo(a, b)`, "foo", "c = 1")).toBe(
      `foo(a, b,\n  c = 1)`,
    );
  });

  it("fills an empty argument list", () => {
    expect(insertLastArgument(`foo()`, "foo", "c = 1")).toBe(`foo(c = 1)`);
  });

  it("keeps the closing parenthesis on its own line", () => {
    const source = `    foo(\n      a = 1\n    )\n`;

    expect(insertLastArgument(source, "foo", "b = 2")).toBe(
      `    foo(\n      a = 1,\n      b = 2\n    )\n`,
    );
  });

  it("ignores parentheses inside line comments", () => {
    const source = `foo(\n  a = 1 // ignore ) this\n)`;

    // The comma has to land before the comment, not after it, or the comment
    // swallows it and the call stops compiling.
    expect(insertLastArgument(source, "foo", "b = 2")).toBe(
      `foo(\n  a = 1,\n  b = 2 // ignore ) this\n)`,
    );
  });

  it("ignores parentheses inside block comments", () => {
    const source = `foo(a /* ) */, b)`;

    expect(insertLastArgument(source, "foo", "c")).toBe(
      `foo(a /* ) */, b,\n  c)`,
    );
  });

  it("ignores parentheses inside strings, escapes included", () => {
    const source = `foo("a )", "b \\" )", c)`;

    expect(insertLastArgument(source, "foo", "d")).toBe(
      `foo("a )", "b \\" )", c,\n  d)`,
    );
  });

  it("ignores parentheses inside Kotlin raw strings", () => {
    const source = `foo("""a ) b""", c)`;

    expect(insertLastArgument(source, "foo", "d")).toBe(
      `foo("""a ) b""", c,\n  d)`,
    );
  });

  it("matches the outermost parenthesis, not the first nested one", () => {
    const source = `foo(bar(baz()), qux)`;

    expect(insertLastArgument(source, "foo", "extra")).toBe(
      `foo(bar(baz()), qux,\n  extra)`,
    );
  });

  it("returns null when the call is absent", () => {
    expect(insertLastArgument(`bar(a)`, "foo", "b")).toBeNull();
  });

  it("returns null when the parentheses never close", () => {
    expect(insertLastArgument(`foo(a, bar(b)`, "foo", "c")).toBeNull();
  });

  it("returns null when a string swallows the rest of the file", () => {
    expect(insertLastArgument(`foo(a, "unterminated)`, "foo", "c")).toBeNull();
  });
});
