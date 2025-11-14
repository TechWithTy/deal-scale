import { createSelectionCache } from "../selectionCache";

describe("createSelectionCache", () => {
	it("returns the cached selection when equality reports no change", () => {
		const cache = createSelectionCache<{ readonly value: number }>();
		const first = cache.read({ value: 1 }, (a, b) => a.value === b.value);
		const second = cache.read({ value: 1 }, (a, b) => a.value === b.value);

		expect(second).toBe(first);
	});

	it("returns the new selection when equality reports a change", () => {
		const cache = createSelectionCache<{ readonly value: number }>();
		const first = cache.read({ value: 1 }, (a, b) => a.value === b.value);
		const second = cache.read({ value: 2 }, (a, b) => a.value === b.value);

		expect(second).not.toBe(first);
		expect(second).toEqual({ value: 2 });
	});
});
