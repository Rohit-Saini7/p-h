/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  moduleNameMapper: {
    "\\.(jpg|png|svg)$": "../mocks/dummyLogo.js",
  },
  testEnvironment: "jsdom",
};
