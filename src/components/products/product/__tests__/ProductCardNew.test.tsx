import {
	describe,
	expect,
	it,
	vi,
} from "vitest";
import "@testing-library/jest-dom/vitest";
import type { ProductType } from "@/types/products";
import type { ABTest } from "@/types/testing";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import ProductCardNew from "../ProductCardNew";

vi.mock("framer-motion", () => ({
	motion: {
		div: ({
			children,
			layout: _layout,
			whileHover: _whileHover,
			transition: _transition,
			...rest
		}: { children: ReactNode } & Record<string, unknown>) => (
			<div {...rest}>{children}</div>
		),
	},
	useReducedMotion: () => true,
}));

vi.mock("react-hot-toast", () => ({
	success: vi.fn(),
	error: vi.fn(),
	loading: vi.fn(),
}));

const addItemMock = vi.fn();

vi.mock("@/stores/useCartStore", () => ({
	useCartStore: () => addItemMock,
}));

describe("ProductCardNew", () => {
	const baseProduct: ProductType = {
		id: "test-id",
		name: "AI Conversation Credits",
		description:
			"Keep your AI agents running with credits that fuel every outreach.",
		price: 100,
		sku: "SKU-123",
		slug: "ai-conversation-credits",
		images: ["/test.png"],
		reviews: [],
		categories: [],
		types: [],
		colors: [],
		sizes: [],
	};

	const abTest: ABTest = {
		id: "ab-1",
		name: "Primary Messaging",
		startDate: new Date("2024-01-01T00:00:00.000Z"),
		isActive: true,
		variants: [
			{
				name: "Control",
				percentage: 100,
				copy: {
					cta: "Test CTA",
					whatsInItForMe: "Value",
					target_audience: "Investors",
					pain_point: "Manual follow-up drains your pipeline and time.",
					solution: "Automated agents nurture every lead instantly.",
				},
			},
		],
	};

	it("renders the product description with truncation styling", () => {
		render(<ProductCardNew {...baseProduct} abTest={abTest} />);

		const description = screen.getByText(
			"Keep your AI agents running with credits that fuel every outreach.",
		);

		expect(description).toBeInTheDocument();
		expect(description).toHaveClass("line-clamp-3");
	});

	it("displays problem and solution chips sourced from AB test copy", async () => {
		render(<ProductCardNew {...baseProduct} abTest={abTest} />);

		expect(screen.getByText("Problem")).toBeInTheDocument();
		expect(
			screen.getByText("Manual follow-up drains your pipeline and time."),
		).toBeInTheDocument();
		const solutionTrigger = screen.getByRole("button", { name: /solution/i });
		expect(solutionTrigger).toBeInTheDocument();
		fireEvent.click(solutionTrigger);
		expect(
			await screen.findByText("Automated agents nurture every lead instantly."),
		).toBeInTheDocument();
	});

	it("does not render chips when the AB test copy lacks messaging", () => {
		const abTestWithoutCopy: ABTest = {
			...abTest,
			variants: [
				{
					name: "No Copy",
					percentage: 100,
				},
			],
		};

		render(<ProductCardNew {...baseProduct} abTest={abTestWithoutCopy} />);

		expect(screen.queryByText("Problem")).not.toBeInTheDocument();
		expect(screen.queryByText("Solution")).not.toBeInTheDocument();
	});

	it("falls back to the SKU link when a slug is not provided", () => {
		render(
			<ProductCardNew {...baseProduct} slug={undefined} abTest={abTest} />,
		);

		const links = screen.getAllByRole("link", {
			name: /ai conversation credits/i,
		});
		const titleLink = links.find((anchor) =>
			anchor.getAttribute("href")?.startsWith("/products"),
		);

		expect(titleLink).toHaveAttribute("href", "/products/SKU-123");
	});
});
