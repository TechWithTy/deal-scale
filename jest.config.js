module.exports = {
        preset: "ts-jest",
        testEnvironment: "jsdom",
        setupFiles: ["<rootDir>/jest.env.js"], // dotenv only
        setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // fetch polyfill, afterAll
        transform: {
                "^.+\\.(t|j)sx?$": [
                        "ts-jest",
                        {
                                tsconfig: "<rootDir>/tsconfig.app.json",
                        },
                ],
        },
        moduleNameMapper: {
                "^@/(.*)$": "<rootDir>/src/$1",
                "\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
                "^@upstash/redis$": "<rootDir>/__mocks__/@upstash/redis.js",
        },
};
