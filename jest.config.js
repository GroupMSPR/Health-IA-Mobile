module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "context/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "assets/componants/**/*.{ts,tsx}",
    "!**/_layout.tsx",
    "!**/node_modules/**",
  ],
  coverageReporters: ["text", "text-summary", "lcov"],
};