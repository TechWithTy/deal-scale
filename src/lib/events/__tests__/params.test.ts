import {
	resolveEventParams,
	ResolveEventParamsError,
} from "@/lib/events/params";

describe("resolveEventParams", () => {
	it("returns the params when provided an object", async () => {
		const params = { slug: "demo-event" };
		await expect(resolveEventParams(params)).resolves.toEqual(params);
	});

	it("resolves params when provided a promise", async () => {
		const params = Promise.resolve({ slug: "promised-event" });
		await expect(resolveEventParams(params)).resolves.toEqual({
			slug: "promised-event",
		});
	});

	it("throws a ResolveEventParamsError when the slug is missing", async () => {
		await expect(
			resolveEventParams({ slug: "" } as any),
		).rejects.toBeInstanceOf(ResolveEventParamsError);
	});

	it("throws a ResolveEventParamsError when the params promise rejects", async () => {
		const params = Promise.reject(new Error("boom"));
		await expect(resolveEventParams(params)).rejects.toBeInstanceOf(
			ResolveEventParamsError,
		);
	});
});
