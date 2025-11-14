import type { NextConfig } from "next";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

const importConfig = async (): Promise<NextConfig> => {
	const module = await import("../../next.config");
	return module.default;
};

describe("next.config cache headers", () => {
	const originalEnv = process.env.NODE_ENV;

	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		process.env.NODE_ENV = originalEnv;
	});

	it("uses no-store semantics in development", async () => {
		process.env.NODE_ENV = "development";
		const config = await importConfig();
		const headers = await config.headers?.();

		expect(headers).toEqual([
			{
				source: "/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "no-store, must-revalidate",
					},
				],
			},
		]);
	});

	it("retains immutable caching in production", async () => {
		process.env.NODE_ENV = "production";
		const config = await importConfig();
		const headers = await config.headers?.();

		expect(headers).toEqual([
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/_next/image",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/:all*(svg|png|jpg|jpeg|gif|webp|avif|woff2)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=2592000, must-revalidate",
					},
				],
			},
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/assets/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		]);
	});
});
