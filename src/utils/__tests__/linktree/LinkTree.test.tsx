import { LinkTree } from "@/components/linktree/LinkTree";
import type { LinkTreeItem } from "@/utils/linktree-redis";
import { render, screen, within } from "@testing-library/react";
import React from "react";

function make(over: Partial<LinkTreeItem> = {}): LinkTreeItem {
	return {
		slug: over.slug ?? "demo",
		title: over.title ?? "Demo",
		destination: over.destination ?? "/x",
		description: over.description,
		details: over.details,
		iconEmoji: over.iconEmoji,
		linkTreeEnabled: over.linkTreeEnabled,
		imageUrl: over.imageUrl,
		thumbnailUrl: over.thumbnailUrl,
		category: over.category,
		pinned: over.pinned,
		videoUrl: over.videoUrl,
		files: over.files,
		highlighted: over.highlighted,
		redirectExternal: over.redirectExternal,
		pageId: over.pageId,
	} as LinkTreeItem;
}

describe("LinkTree component", () => {
	test("renders highlighted section label and items", () => {
		const items: LinkTreeItem[] = [
			make({
				slug: "h1",
				title: "H1",
				destination: "/h1",
				highlighted: true,
				category: "Product",
			}),
			make({ slug: "n1", title: "N1", destination: "/n1", category: "Other" }),
		];

		render(<LinkTree items={items} title="Link Tree" />);

		// Highlighted label present
		expect(screen.getByText(/Highlighted - Product/i)).toBeInTheDocument();

		// Links render
		expect(screen.getByRole("link", { name: "H1" })).toHaveAttribute(
			"href",
			"/h1",
		);
		expect(screen.getByRole("link", { name: "N1" })).toHaveAttribute(
			"href",
			"/n1",
		);
	});

	test("external items get target=_blank via resolveLink", () => {
		const items: LinkTreeItem[] = [
			make({
				slug: "ext",
				title: "Ext",
				destination: "https://example.com/x",
				category: "Cat",
			}),
		];

		render(<LinkTree items={items} title="Link Tree" />);

		const a = screen.getByRole("link", { name: "Ext" });
		expect(a).toHaveAttribute("href", "/ext");
		expect(a).toHaveAttribute("target", "_blank");
	});
});
