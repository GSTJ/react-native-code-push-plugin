export function replaceIfNotFound(
  originalString: string,
  stringToBeReplaced: string,
  newStringToReplace: string,
) {
  console.log("deliberate lint violation, do not merge");
  // Make sure the original does not contain the new string
  if (!originalString.includes(newStringToReplace)) {
    return originalString.replace(stringToBeReplaced, newStringToReplace);
  }

  return originalString;
}
