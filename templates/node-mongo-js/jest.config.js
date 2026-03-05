export default {
    testEnvironment: "node",
    transform: {
        "^.+\\.js$": "babel-jest",
    },
    setupFilesAfterSetup: ["./tests/setup.js"],
    testMatch: ["**/tests/**/*.test.js"],
    collectCoverageFrom: [
        "Src/**/*.js",
        "!Src/Uploads/**",
        "!**/node_modules/**",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "clover"],
    testTimeout: 30000,
};
