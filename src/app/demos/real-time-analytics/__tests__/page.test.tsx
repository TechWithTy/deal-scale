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

class ResizeObserverMock {
	observe(): void {}
	unobserve(): void {}
	disconnect(): void {}
}

class IntersectionObserverMock {
	private readonly callback: IntersectionObserverCallback;

	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
	}

	observe(element: Element): void {
		this.callback(
			[
				{
					isIntersecting: true,
					target: element,
				} as IntersectionObserverEntry,
			],
			this as unknown as IntersectionObserver,
		);
	}

	unobserve(): void {}
	disconnect(): void {}
}

let originalResizeObserver: typeof global.ResizeObserver | undefined;
let originalIntersectionObserver:
	| typeof global.IntersectionObserver
	| undefined;

beforeAll(() => {
	originalResizeObserver = global.ResizeObserver;
	// @ts-expect-error - ResizeObserver is not implemented in JSDOM
	if (!global.ResizeObserver) {
		// @ts-expect-error - assigning mock
		global.ResizeObserver = ResizeObserverMock;
	}

	originalIntersectionObserver = global.IntersectionObserver;
	// @ts-expect-error - IntersectionObserver is not implemented in JSDOM
	if (!global.IntersectionObserver) {
		// @ts-expect-error - assigning mock
		global.IntersectionObserver = IntersectionObserverMock;
	}
});

let warnSpy: jest.SpyInstance;

beforeAll(() => {
	const originalWarn = console.warn.bind(console);
	warnSpy = jest
		.spyOn(console, "warn")
		.mockImplementation((message, ...args) => {
			if (
				typeof message === "string" &&
				message.includes("The width(0) and height(0) of chart")
			) {
				return;
			}

			originalWarn(message, ...args);
		});
});

afterAll(() => {
	warnSpy?.mockRestore();
});

afterAll(() => {
	if (originalIntersectionObserver) {
		// @ts-expect-error - restore original implementation
		global.IntersectionObserver = originalIntersectionObserver;
	} else if (global.IntersectionObserver === IntersectionObserverMock) {
		// @ts-expect-error - clean up test mock
		delete global.IntersectionObserver;
	}

	if (originalResizeObserver) {
		// @ts-expect-error - restore original implementation
		global.ResizeObserver = originalResizeObserver;
	} else if (global.ResizeObserver === ResizeObserverMock) {
		// @ts-expect-error - clean up test mock
		delete global.ResizeObserver;
	}
});

describe("RealTimeAnalytics demo showcase", () => {
	it("renders the default feature with its Macbook media", async () => {
		render(<FeatureShowcase features={REAL_TIME_FEATURES} />);

		const defaultFeature = REAL_TIME_FEATURES[0];

		expect(
			screen.getByRole("tab", {
				name: defaultFeature.label,
				selected: true,
			}),
		).toBeInTheDocument();

		expect(
			await screen.findByAltText(defaultFeature.media.alt),
		).toBeInTheDocument();

		expect(
			await screen.findByTestId("realtime-analytics-chart"),
		).toBeInTheDocument();

		for (const highlight of defaultFeature.highlights) {
			expect(await screen.findByText(highlight.title)).toBeInTheDocument();
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
			await screen.findByAltText(targetFeature.media.alt),
		).toBeInTheDocument();

		for (const highlight of targetFeature.highlights) {
			expect(await screen.findByText(highlight.title)).toBeInTheDocument();
		}
	});
});
