/**
 * Inserts a line below an anchor, and throws if the anchor isn't there.
 *
 * The two checks used to run the other way round, which made the throw
 * unreachable in the case that matters: a missing anchor fell into
 * `String.replace`, which returns the input untouched when the needle is
 * absent, so the caller got a silent no-op. A missing anchor now throws, and
 * an insertion that's already applied returns early.
 *
 * @param originalString The file contents.
 * @param anchor The line to insert below.
 * @param stringToBeAdded The line to insert.
 * @returns The contents with the line inserted, or unchanged if it was already
 *   there.
 */
export function addBelowAnchorIfNotFound(
  originalString: string,
  anchor: string,
  stringToBeAdded: string,
) {
  // Already applied, so the anchor has done its job whether or not it survived.
  if (originalString.includes(stringToBeAdded)) {
    return originalString;
  }

  if (!originalString.includes(anchor)) {
    throw new Error(
      `The anchor string "${anchor}" was not found in the original string.`,
    );
  }

  return originalString.replace(anchor, `${anchor}\n${stringToBeAdded}`);
}
