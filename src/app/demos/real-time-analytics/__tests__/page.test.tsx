import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FeatureShowcase } from "@/components/demos/real-time-analytics/FeatureShowcase";
import { REAL_TIME_FEATURES } from "@/components/demos/real-time-analytics/feature-config";

jest.mock("@/components/ui/macbook-scroll", () => ({
	__esModule: true,
	MacbookScroll: ({
		src,
		title,
	}: {
		src?: string;
		title?: string;
	}) => (
		<div data-testid="macbook-scroll">
			{src ? <img src={src} alt={title ?? "macbook-demo"} /> : null}
		</div>
	),
}));

describe("RealTimeAnalytics demo showcase", () => {
	it("renders the default feature with its Macbook media", () => {
		render(<FeatureShowcase features={REAL_TIME_FEATURES} />);

		const defaultFeature = REAL_TIME_FEATURES[0];

		expect(
			screen.getByRole("tab", {
				name: defaultFeature.label,
				selected: true,
			}),
		).toBeInTheDocument();

		expect(
			screen.getByAltText(defaultFeature.media.alt),
		).toBeInTheDocument();

		for (const highlight of defaultFeature.highlights) {
			expect(screen.getByText(highlight.title)).toBeInTheDocument();
		}
	});

	it("allows switching between feature demos and updates the Macbook media", async () => {
		const user = userEvent.setup();
		render(<FeatureShowcase features={REAL_TIME_FEATURES} />);

		const targetFeature = REAL_TIME_FEATURES[1];
		await user.click(
			screen.getByRole("tab", {
				name: targetFeature.label,
			}),
		);

		expect(
			screen.getByRole("tab", {
				name: targetFeature.label,
				selected: true,
			}),
		).toBeInTheDocument();

		expect(
			screen.getByAltText(targetFeature.media.alt),
		).toBeInTheDocument();

		for (const highlight of targetFeature.highlights) {
			expect(screen.getByText(highlight.title)).toBeInTheDocument();
		}
	});
});

