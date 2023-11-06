"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceIfNotFound = void 0;
function replaceIfNotFound(originalString, stringToBeReplaced, newStringToReplace) {
    // Make sure the original does not contain the new string
    if (!originalString.includes(newStringToReplace)) {
        return originalString.replace(stringToBeReplaced, newStringToReplace);
    }
    return originalString;
}
exports.replaceIfNotFound = replaceIfNotFound;
//# sourceMappingURL=replaceIfNotFound.js.map