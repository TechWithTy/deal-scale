import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import type { PersonaKey } from "@/data/personas/catalog";
import {
	resetPersonaStore,
	usePersonaStore,
} from "@/stores/usePersonaStore";

const CardStackMock = vi.fn(
	({ items }: { items?: Array<{ id: string }> }) => (
		<div data-testid="card-stack" data-count={items?.length ?? 0} />
	),
);
vi.mock("@/components/ui/card-stack", () => ({
	__esModule: true,
	CardStack: CardStackMock,
	default: CardStackMock,
}));

const GlareCardMock = vi.fn(({ children }: { children: React.ReactNode }) => (
	<div data-testid="glare-card">{children}</div>
));
vi.mock("@/components/ui/glare-card", () => ({
	__esModule: true,
	GlareCard: GlareCardMock,
	default: GlareCardMock,
}));

const ClientLottieMock = vi.fn(() => <div data-testid="client-lottie" />);
vi.mock("@/components/ui/ClientLottie", () => ({
	__esModule: true,
	ClientLottie: ClientLottieMock,
	default: ClientLottieMock,
}));

const loadFeatureSectionActivity = async () =>
	(await import("../FeatureSectionActivity")).default;

const TEST_PERSONA_KEY: PersonaKey = "agent";
const TEST_PERSONA_GOAL = "Close listings automatically";

describe("FeatureSectionActivity", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetPersonaStore();
		usePersonaStore
			.getState()
			.setPersonaAndGoal(TEST_PERSONA_KEY, TEST_PERSONA_GOAL);
	});

	it("renders the card stack with activity cards", async () => {
		const FeatureSectionActivity = await loadFeatureSectionActivity();

		render(<FeatureSectionActivity />);

		expect(screen.getByTestId("card-stack")).toBeInTheDocument();
		expect(CardStackMock).toHaveBeenCalled();
		const [{ items }] =
			CardStackMock.mock.calls[CardStackMock.mock.calls.length - 1] ?? [{}];
		expect((items ?? []).length).toBeGreaterThan(0);
	});

	it("reflects persona label and goal driven by the store", async () => {
		const FeatureSectionActivity = await loadFeatureSectionActivity();

		render(<FeatureSectionActivity />);

		expect(
			screen.getAllByText(/Agents/i, { selector: "span" }).length,
		).toBeGreaterThan(0);
		expect(
			screen.getByText((content) =>
				content.includes(TEST_PERSONA_GOAL),
			),
		).toBeInTheDocument();
	});
});
