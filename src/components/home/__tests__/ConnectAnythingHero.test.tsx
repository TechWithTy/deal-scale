import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

type MockMarqueeImage = { src: string; alt?: string };

type ConnectAnythingHeroType = typeof import("../ConnectAnythingHero")
	.ConnectAnythingHero;

let ConnectAnythingHero: ConnectAnythingHeroType;
let latestImages: MockMarqueeImage[] = [];

vi.mock("@/components/ui/3d-marquee", () => ({
	ThreeDMarquee: ({ images }: { images: MockMarqueeImage[] }) => {
		latestImages = images;
		return <div data-testid="three-d-marquee" />;
	},
}));

beforeAll(async () => {
	({ ConnectAnythingHero } = await import("../ConnectAnythingHero"));
});

describe("ConnectAnythingHero", () => {
	beforeEach(() => {
		latestImages = [];
	});

	it("renders the headline and initial rotating message", () => {
		render(<ConnectAnythingHero />);

		expect(
			screen.getByRole("heading", {
				level: 1,
				name: /connect anything\. automate everything\./i,
			}),
		).toBeInTheDocument();
		expect(
			screen.getByText(/sync your crm with ai precision\./i),
		).toBeInTheDocument();
	});

	it("passes branded image sources to the 3d marquee", () => {
		render(<ConnectAnythingHero />);

		expect(screen.getByTestId("three-d-marquee")).toBeInTheDocument();
		expect(latestImages.length).toBeGreaterThan(0);
		expect(latestImages.map(({ src }) => src)).toEqual(
			expect.arrayContaining([
				"https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg",
				"https://upload.wikimedia.org/wikipedia/commons/9/96/Zoho-logo.png",
				"https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg",
			]),
		);
	});
});
