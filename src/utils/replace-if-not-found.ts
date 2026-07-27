/**
 * Swaps one string for another, once, and throws if there was nothing to swap.
 *
 * The throw is the point. This used to hand back the input untouched when
 * `stringToBeReplaced` was missing, because `String.replace` on a needle that
 * isn't there is a no-op, so prebuild reported success while writing nothing.
 * That is how #30 went unnoticed for five SDK releases.
 *
 * @param originalString The file contents.
 * @param stringToBeReplaced The text to look for.
 * @param newStringToReplace The text to put in its place.
 * @param description What the caller was trying to do, used in the error.
 * @returns The replaced contents, or the input unchanged if the replacement is
 *   already there.
 */
export function replaceIfNotFound(
  originalString: string,
  stringToBeReplaced: string,
  newStringToReplace: string,
  description?: string,
) {
  // Already applied, so there is nothing to look for.
  if (originalString.includes(newStringToReplace)) {
    return originalString;
  }

  if (!originalString.includes(stringToBeReplaced)) {
    throw new Error(
      `${description ?? "Cannot apply the CodePush change"}: expected to find "${stringToBeReplaced}" and it is not there.`,
    );
  }

  return originalString.replace(stringToBeReplaced, newStringToReplace);
}
