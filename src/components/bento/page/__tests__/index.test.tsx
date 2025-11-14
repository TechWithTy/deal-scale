import BentoPage from "..";
import { render, screen } from "@testing-library/react";
import type { BentoFeature } from "@/types/bento/features";

describe("BentoPage", () => {
	const features: BentoFeature[] = [
		{
			title: "AI Lead Routing",
			description: "Route leads automatically",
			icon: <span data-testid="icon">🤖</span>,
			className: "col-span-1",
			content: <span>Scale outbound automatically.</span>,
			background: <span data-testid="background">BG</span>,
		},
	];

	it("renders feature content and background overlays", () => {
		render(
			<BentoPage
				title="Platform Features"
				subtitle="Designed for revenue teams"
				features={features}
			/>,
		);

		expect(screen.getByText("Platform Features")).toBeInTheDocument();
		expect(screen.getByTestId("background")).toBeInTheDocument();
		expect(screen.getByText("Route leads automatically")).toBeInTheDocument();
	});
});

