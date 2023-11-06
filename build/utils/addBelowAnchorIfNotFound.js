"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBelowAnchorIfNotFound = void 0;
function addBelowAnchorIfNotFound(originalString, anchor, stringToBeAdded) {
    // Make sure the original does not contain the new string
    if (!originalString.includes(stringToBeAdded)) {
        return originalString.replace(anchor, `${anchor}\n${stringToBeAdded}`);
    }
    return originalString;
}
exports.addBelowAnchorIfNotFound = addBelowAnchorIfNotFound;
//# sourceMappingURL=addBelowAnchorIfNotFound.js.map