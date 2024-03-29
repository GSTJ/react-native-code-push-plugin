export function addBelowAnchorIfNotFound(
  originalString: string,
  anchor: string,
  stringToBeAdded: string
) {
  // Make sure the original does not contain the new string
  if (!originalString.includes(stringToBeAdded)) {
    return originalString.replace(anchor, `${anchor}\n${stringToBeAdded}`);
  }

  if (!originalString.includes(anchor)) {
    throw new Error(
      `The anchor string "${anchor}" was not found in the original string.`
    );
  }

  return originalString;
}
