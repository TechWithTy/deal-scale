module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	setupFiles: ["<rootDir>/jest.env.js"], // dotenv only
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // fetch polyfill, afterAll
	testMatch: [
		"**/__tests__/**/*.[jt]s?(x)",
		"**/?(*.)+(spec|test).[tj]s?(x)",
		"**/*.__tests__.[tj]s?(x)",
	],
	transform: {
		"^.+\\.(t|j)sx?$": [
			"ts-jest",
			{
				tsconfig: "<rootDir>/tsconfig.tests.json",
			},
		],
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^@external/dynamic-hero$":
			"<rootDir>/src/components/dynamic-hero/src/index.ts",
		"^@external/dynamic-hero/(.*)$":
			"<rootDir>/src/components/dynamic-hero/src/$1",
		"\\.(css|scss|sass)$": "<rootDir>/__mocks__/fileMock.js",
		"\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
		"^@upstash/redis$": "<rootDir>/__mocks__/@upstash/redis.js",
		"^server-only$": "<rootDir>/__mocks__/server-only.ts",
	},
};
