import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";

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

describe("FeatureSectionActivity", () => {
	beforeEach(() => {
		vi.clearAllMocks();
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
});
