module.exports = {
  testEnvironment: "node",
  testRegex: "/__tests__/.*(test|spec)\\.[jt]sx?$",
  transform: { "^.+\\.[jt]sx?$": "<rootDir>/tools/jest-transform.cjs" },
};
