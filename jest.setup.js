// jest.setup.js
require("@testing-library/jest-dom");
afterAll(async () => {
	if (
		global.fetch &&
		global.fetch.__agent &&
		typeof global.fetch.__agent.destroy === "function"
	) {
		global.fetch.__agent.destroy();
	}
});
