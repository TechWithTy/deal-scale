// jest.setup.js
require("@testing-library/jest-dom");

// Polyfill Next.js server web APIs for middleware tests
if (typeof global.Request === "undefined") {
	const { Request, Response, Headers } = require("node-fetch");
	global.Request = Request;
	global.Response = Response;
	global.Headers = Headers;
}

afterAll(async () => {
	if (
		global.fetch &&
		global.fetch.__agent &&
		typeof global.fetch.__agent.destroy === "function"
	) {
		global.fetch.__agent.destroy();
	}
});
