import { addBelowAnchorIfNotFound } from "../add-below-anchor-if-not-found";
import { replaceIfNotFound } from "../replace-if-not-found";

describe("addBelowAnchorIfNotFound", () => {
  it("inserts below the anchor", () => {
    expect(addBelowAnchorIfNotFound("a\nb\n", "a", "new")).toBe("a\nnew\nb\n");
  });

  it("does not insert twice", () => {
    const once = addBelowAnchorIfNotFound("a\nb\n", "a", "new");

    expect(addBelowAnchorIfNotFound(once, "a", "new")).toBe(once);
  });

  // The two checks used to run the other way round, so a missing anchor fell
  // into a `String.replace` that matched nothing and returned the input.
  it("throws on a missing anchor rather than returning the input", () => {
    expect(() => addBelowAnchorIfNotFound("a\nb\n", "missing", "new")).toThrow(
      /anchor string "missing"/,
    );
  });

  it("stays quiet when the insertion is there and the anchor is gone", () => {
    expect(addBelowAnchorIfNotFound("new\n", "missing", "new")).toBe("new\n");
  });
});

describe("replaceIfNotFound", () => {
  it("replaces the target", () => {
    expect(replaceIfNotFound("a b c", "b", "B")).toBe("a B c");
  });

  it("replaces only the first occurrence", () => {
    expect(replaceIfNotFound("b b", "b", "B")).toBe("B b");
  });

  it("does not replace twice", () => {
    const once = replaceIfNotFound("a b c", "b", "B");

    expect(replaceIfNotFound(once, "b", "B")).toBe(once);
  });

  it("throws when there is nothing to replace", () => {
    expect(() => replaceIfNotFound("a c", "b", "B")).toThrow(
      /expected to find "b"/,
    );
  });

  it("puts the caller's description in the error", () => {
    expect(() =>
      replaceIfNotFound("a c", "b", "B", "Cannot do the thing"),
    ).toThrow(/Cannot do the thing/);
  });
});
