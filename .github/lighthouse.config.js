module.exports = {
	ci: {
		collect: {
			staticDistDir: "./dist",
			numberOfRuns: 1,
			settings: {
				onlyCategories: ["seo", "performance"],
			},
		},
		assert: {
			assertions: {
				"categories:seo": ["error", { minScore: 0.9 }],
				"categories:performance": ["warn", { minScore: 0.7 }],
			},
		},
	},
};




