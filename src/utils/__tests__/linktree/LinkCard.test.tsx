import { LinkCard } from "@/components/linktree/LinkCard";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("LinkCard", () => {
	test("renders title and description", () => {
		render(
			<LinkCard
				title="My Link"
				href="/internal"
				description="Desc"
				showArrow
			/>,
		);
		expect(screen.getByText("My Link")).toBeInTheDocument();
		expect(screen.getByText("Desc")).toBeInTheDocument();
	});

	test("internal href keeps same tab by default", () => {
		render(<LinkCard title="X" href="/x" />);
		const a = screen.getByRole("link", { name: /x/i });
		// anchor text is the title; role name might be title string
		expect(a).toHaveAttribute("href", "/x");
		expect(a).not.toHaveAttribute("target", "_blank");
	});

	test("external href opens new tab", () => {
		render(<LinkCard title="Y" href="https://example.com" />);
		const a = screen.getByRole("link", { name: /y/i });
		expect(a).toHaveAttribute("href", "https://example.com");
		expect(a).toHaveAttribute("target", "_blank");
	});

	test("openInNewTab forces new tab for internal", () => {
		render(<LinkCard title="Z" href="/z" openInNewTab />);
		const a = screen.getByRole("link", { name: /z/i });
		expect(a).toHaveAttribute("target", "_blank");
	});
});
