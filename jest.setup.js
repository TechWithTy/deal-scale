// jest.setup.js
afterAll(async () => {
	if (
		global.fetch &&
		global.fetch.__agent &&
		typeof global.fetch.__agent.destroy === "function"
	) {
		global.fetch.__agent.destroy();
	}
});
