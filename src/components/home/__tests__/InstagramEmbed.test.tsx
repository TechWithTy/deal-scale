import {
	describe,
	expect,
	it,
	vi,
} from "vitest";
import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import InstagramEmbed from "../InstagramEmbed";

vi.mock("next-themes", () => ({
	useTheme: () => ({ resolvedTheme: "light" }),
}));

describe("InstagramEmbed", () => {
	it("shows the loading indicator until the iframe reports it has loaded", () => {
		render(<InstagramEmbed />);

		const loader = screen.getByTestId("instagram-embed-loading");
		const iframe = screen.getByTitle("Deal Scale Instagram feed");

		expect(loader).toBeInTheDocument();
		expect(loader).toHaveAttribute("aria-hidden", "false");

		fireEvent.load(iframe);

		expect(loader).toHaveAttribute("aria-hidden", "true");
	});

	it("points the iframe to the Deal Scale Instagram embed", () => {
		render(<InstagramEmbed />);

		const iframe = screen.getByTitle("Deal Scale Instagram feed");

		expect(iframe).toHaveAttribute(
			"src",
			expect.stringContaining("https://www.instagram.com/deal_scale/embed"),
		);
	});
});

