module.exports = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			2,
			"always",
			[
				"feat",
				"fix",
				"docs",
				"style",
				"refactor",
				"perf",
				"test",
				"build",
				"ci",
				"chore",
				"revert",
			],
		],
		"scope-enum": [
			2,
			"always",
			[
				"ui",
				"ux",
				"layout",
				"page",
				"api",
				"hooks",
				"state",
				"assets",
				"config",
				"deps",
				"styles",
				"tests",
				"docs",
				"core",
			],
		],
		"subject-case": [0],
		"subject-full-stop": [2, "never"],
		"header-max-length": [2, "always", 88],
	},
};





