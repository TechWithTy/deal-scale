import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";

const navigationRouterMock = () => ({
	push: vi.fn(),
	replace: vi.fn(),
	prefetch: vi.fn(),
	refresh: vi.fn(),
	back: vi.fn(),
	forward: vi.fn(),
});

vi.mock("next/navigation", () => ({
	__esModule: true,
	usePathname: () => "/blog",
	useRouter: navigationRouterMock,
	useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/components/blog/BlogCard", () => ({
	__esModule: true,
	default: () => <div data-testid="blog-card" />,
}));

const loadBlogGrid = async () =>
	(await import("../BlogGrid")).default;

describe("BlogGrid", () => {
	it("renders without crashing when no posts are available", async () => {
		const BlogGrid = await loadBlogGrid();
		render(<BlogGrid posts={[]} />);
		expect(document.querySelectorAll("[data-testid='blog-card']").length).toBe(
			0,
		);
	});
});
