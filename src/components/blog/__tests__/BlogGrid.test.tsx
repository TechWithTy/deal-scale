import { resetPersonaStore } from "@/stores/usePersonaStore";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const searchParamsState = { value: "" };

vi.mock("next/navigation", () => ({
	__esModule: true,
	usePathname: () => "/blog",
	useRouter: () => ({
		push: pushMock,
		replace: vi.fn(),
		prefetch: vi.fn(),
		refresh: vi.fn(),
		back: vi.fn(),
		forward: vi.fn(),
	}),
	useSearchParams: () => new URLSearchParams(searchParamsState.value),
}));

vi.mock("@/components/blog/BlogCard", () => ({
	__esModule: true,
	default: () => <div data-testid="blog-card" />,
}));

const loadBlogGrid = async () => (await import("../BlogGrid")).default;

describe("BlogGrid", () => {
	beforeEach(() => {
		pushMock.mockClear();
		searchParamsState.value = "";
		resetPersonaStore();
	});

	it("renders without crashing when no posts are available", async () => {
		const BlogGrid = await loadBlogGrid();
		render(<BlogGrid posts={[]} />);
		expect(document.querySelectorAll("[data-testid='blog-card']").length).toBe(
			0,
		);
	});

	it("exposes a page window helper that surfaces three pages around the current page", async () => {
		const { getPageWindow } = await import("../BlogGrid");
		expect(
			getPageWindow({ currentPage: 5, totalPages: 10, windowSize: 3 }),
		).toEqual([4, 5, 6]);
		expect(
			getPageWindow({ currentPage: 1, totalPages: 2, windowSize: 3 }),
		).toEqual([1, 2]);
		expect(
			getPageWindow({ currentPage: 10, totalPages: 10, windowSize: 3 }),
		).toEqual([8, 9, 10]);
	});

	it("renders condensed paginator with three page buttons centered on the active page", async () => {
		searchParamsState.value = "page=2&per_page=5";
		const BlogGrid = await loadBlogGrid();

		const posts = Array.from({ length: 5 }, (_, index) => ({
			id: `post-${index}`,
			title: `Post ${index}`,
			published_at: new Date().toISOString(),
			stats: { web: { views: 10 - index, clicks: 5 - index } },
		})) as any;

		render(<BlogGrid posts={posts} />);

		const pageButtons = screen.getAllByRole("button", { name: /Go to page/ });
		expect(pageButtons).toHaveLength(3);
		expect(pageButtons.map((button) => button.textContent)).toEqual([
			"1",
			"2",
			"3",
		]);

		const nextButton = screen.getByRole("button", { name: "Next page" });
		expect(nextButton).not.toBeDisabled();

		fireEvent.click(screen.getByRole("button", { name: "Go to page 3" }));
		expect(pushMock).toHaveBeenCalledWith("/blogs?page=3&per_page=5");
	});
});
