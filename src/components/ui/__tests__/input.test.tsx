import { stripBackgroundStyleDeclarations } from "../input";

describe("stripBackgroundStyleDeclarations", () => {
	it("removes background related inline styles", () => {
		const result = stripBackgroundStyleDeclarations(
			"background-size: auto, 25px; background-image: none, url(icon.png); color: #000;",
		);

		expect(result).toBe("color: #000");
	});

	it("returns null when no declarations remain", () => {
		const result = stripBackgroundStyleDeclarations(
			"background-repeat: no-repeat; background-position: right center",
		);

		expect(result).toBeNull();
	});

	it("preserves unrelated declarations", () => {
		const result = stripBackgroundStyleDeclarations(
			"border: 1px solid red; padding: 8px;",
		);

		expect(result).toBe("border: 1px solid red; padding: 8px");
	});
});
