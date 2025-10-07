import { render, screen } from "@testing-library/react";

import HeroSessionMonitor from "@/components/home/heros/HeroSessionMonitor";

jest.mock("next-themes", () => ({
	useTheme: () => ({ theme: "light", setTheme: () => undefined }),
}));

jest.mock("@/components/deal_scale/demo/tabs/DemoTabs", () => () => (
	<div data-testid="demo-tabs" />
));

describe("HeroSessionMonitor", () => {
	it("renders highlight content once mounted", async () => {
		render(
			<HeroSessionMonitor
				headline="Test Headline"
				subheadline="A helpful summary"
				highlight="Important Highlight"
				ctaLabel="Primary CTA"
				onCtaClick={() => undefined}
			/>,
		);

		expect(await screen.findByText("Test Headline")).toBeInTheDocument();
		expect(screen.getByText("Important Highlight")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Primary CTA" }),
		).toBeInTheDocument();
		expect(screen.getByTestId("demo-tabs")).toBeInTheDocument();
	});
});
