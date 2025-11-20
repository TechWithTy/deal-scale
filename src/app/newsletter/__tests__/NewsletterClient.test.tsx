import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type DataModuleSelector<T> = (value: any) => T;

const useDataModuleMock = vi.fn();

vi.mock("@/stores/useDataModuleStore", () => ({
	__esModule: true,
	useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

vi.mock("@/components/home/Testimonials", () => ({
	__esModule: true,
	default: vi.fn(() => <div data-testid="testimonials-component" />),
}));

vi.mock("@/components/contact/utils/TrustedByScroller", () => ({
	__esModule: true,
	default: vi.fn(() => <div data-testid="trusted-by" />),
}));

vi.mock("@/components/home/heros/Hero", () => ({
	__esModule: true,
	default: vi.fn(() => <div data-testid="hero" />),
}));

vi.mock("@/components/contact/newsletter/NewsletterEmailInput", () => ({
	__esModule: true,
	NewsletterEmailInput: () => <div data-testid="newsletter-input" />,
}));

vi.mock("@/components/home/BlogPreview", () => ({
	__esModule: true,
	BlogPreview: () => <div data-testid="blog-preview" />,
}));

vi.mock("@/components/home/ClientBento", () => ({
	__esModule: true,
	default: () => <div data-testid="client-bento" />,
}));

vi.mock("@/components/ui/separator", () => ({
	__esModule: true,
	Separator: () => <div data-testid="separator" />,
}));

const loadNewsletterClient = async () =>
	(await import("../NewsletterClient")).default;

describe("NewsletterClient", () => {
	beforeEach(() => {
		useDataModuleMock.mockReset();
	});

	it("renders a loading fallback while testimonials are idle", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: DataModuleSelector<unknown>) => {
				if (key === "service/slug_data/testimonials") {
					return selector({
						status: "idle",
						data: undefined,
						error: undefined,
					});
				}

				return selector({
					status: "ready",
					data: { companyLogos: {} },
					error: undefined,
				});
			},
		);

		const NewsletterClient = await loadNewsletterClient();

		render(<NewsletterClient posts={[]} />);

		expect(screen.getByText(/Loading testimonials/i)).toBeInTheDocument();
		expect(
			screen.queryByTestId("testimonials-component"),
		).not.toBeInTheDocument();
	});

	it("shows a friendly message when testimonials are ready but empty", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: DataModuleSelector<unknown>) => {
				if (key === "service/slug_data/testimonials") {
					return selector({
						status: "ready",
						data: { generalDealScaleTestimonials: [] },
						error: undefined,
					});
				}

				return selector({
					status: "ready",
					data: { companyLogos: {} },
					error: undefined,
				});
			},
		);

		const NewsletterClient = await loadNewsletterClient();

		render(<NewsletterClient posts={[]} />);

		expect(screen.getByText(/Testimonials coming soon/i)).toBeInTheDocument();
		expect(
			screen.queryByTestId("testimonials-component"),
		).not.toBeInTheDocument();
	});
});
