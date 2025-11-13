import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

const addItemMock = vi.fn();
const useCartStoreMock = vi.fn(() => ({
	addItem: addItemMock,
}));

vi.mock("@/stores/useCartStore", () => ({
	__esModule: true,
	useCartStore: (...args: unknown[]) => useCartStoreMock(...args),
}));

const SocialShareMock = vi.fn(() => <div data-testid="social-share" />);
vi.mock("@/components/common/social/SocialShare", () => ({
	__esModule: true,
	SocialShare: SocialShareMock,
}));

const loadProductActions = async () =>
	(await import("../ProductActions")).default;

describe("ProductActions", () => {
	it("renders add to cart button when product is not in cart", async () => {
		const ProductActions = await loadProductActions();

		render(
			<ProductActions
				product={{
					id: "prod-1",
					slug: "prod",
					title: "Product",
					description: "",
					categories: [],
					features: [],
					solutions: [],
					benefits: [],
					pricing: [],
				}}
			/>,
		);

		expect(screen.getByRole("button", { name: /add to cart/i })).toBeInTheDocument();
		expect(SocialShareMock).toHaveBeenCalled();
	});
});
