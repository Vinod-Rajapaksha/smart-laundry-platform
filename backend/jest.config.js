export default {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  testMatch: ["**/src/tests/**/*.test.ts", "**/src/tests/**/*.spec.ts"],
  extensionsToTreatAsEsm: [".ts"],
};
