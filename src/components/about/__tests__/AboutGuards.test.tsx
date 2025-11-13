import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type React from "react";

const useDataModuleMock = vi.fn();

vi.mock("@/stores/useDataModuleStore", () => ({
	__esModule: true,
	useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

vi.mock("@/components/common/Header", () => ({
	__esModule: true,
	default: ({ title }: { title: string }) => (
		<div data-testid="header">{title}</div>
	),
}));

vi.mock("@/components/magicui/aurora-text", () => ({
	__esModule: true,
	AuroraText: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="aurora-text">{children}</div>
	),
}));

vi.mock("@/components/magicui/blur-fade", () => ({
	__esModule: true,
	BlurFade: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="blur-fade">{children}</div>
	),
}));

vi.mock("@/components/ui/timeline", () => ({
	__esModule: true,
	Timeline: ({ data }: { data: unknown[] }) => (
		<div
			data-testid="timeline"
			data-count={Array.isArray(data) ? data.length : 0}
		/>
	),
}));

const loadAboutHero = async () => (await import("../AboutHero")).default;
const loadAboutTimeline = async () => (await import("../AboutTimeline")).default;

describe("About components data module guards", () => {
	beforeEach(() => {
		useDataModuleMock.mockReset();
	});

	it("renders the loading fallback while AboutHero data is idle", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: (state: unknown) => unknown) => {
				if (key === "about/hero") {
					return selector({
						status: "idle",
						data: undefined,
						error: undefined,
					});
				}

				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

		const AboutHero = await loadAboutHero();

		render(<AboutHero />);

		expect(screen.getByText(/Loading story/i)).toBeInTheDocument();
	});

	it("renders the loading fallback while AboutTimeline data is idle", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: (state: unknown) => unknown) => {
				if (key === "about/timeline") {
					return selector({
						status: "idle",
						data: undefined,
						error: undefined,
					});
				}

				return selector({
					status: "ready",
					data: { timeline: [] },
					error: undefined,
				});
			},
		);

		const AboutTimeline = await loadAboutTimeline();

		render(<AboutTimeline />);

		expect(screen.getByText(/Loading timeline/i)).toBeInTheDocument();
		expect(screen.queryByTestId("timeline")).not.toBeInTheDocument();
	});

	it("shows a friendly placeholder when the timeline module resolves empty", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: (state: unknown) => unknown) => {
				if (key === "about/timeline") {
					return selector({
						status: "ready",
						data: { timeline: [] },
						error: undefined,
					});
				}

				return selector({ status: "ready", data: {}, error: undefined });
			},
		);

		const AboutTimeline = await loadAboutTimeline();

		render(<AboutTimeline />);

		expect(screen.getByText(/timeline coming soon/i)).toBeInTheDocument();
	});
});
