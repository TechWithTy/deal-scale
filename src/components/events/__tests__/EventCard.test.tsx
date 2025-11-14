import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type React from "react";

vi.mock("@/components/common/VideoModal", () => ({
	__esModule: true,
	default: () => null,
}));

vi.mock("next/image", () => ({
	__esModule: true,
	default: (props: React.ComponentPropsWithoutRef<"img">) => (
		// eslint-disable-next-line @next/next/no-img-element
		<img alt={props.alt ?? ""} {...props} />
	),
}));

let EventCard: typeof import("../EventCard").default;

const baseEvent = {
	id: "evt-1",
	title: "DealScale Insider Summit",
	date: "2025-01-01",
	time: "09:00 - 17:00",
	description: "Gathering of internal stakeholders to review growth roadmap.",
	thumbnailImage: "https://example.com/event.jpg",
	externalUrl: "https://example.com/register",
	category: "conference",
	location: "Austin, TX",
	isFeatured: false,
	slug: "dealscale-insider-summit",
} as const;

type TestEvent = typeof baseEvent & {
	accessType: "internal" | "external";
	attendanceType: "in-person" | "webinar" | "hybrid";
	internalPath?: string;
};

function buildEvent(overrides: Partial<TestEvent> = {}): TestEvent {
	return {
		...baseEvent,
		accessType: "external",
		attendanceType: "in-person",
		...overrides,
	};
}

beforeEach(async () => {
	({ default: EventCard } = await import("../EventCard"));
});

describe("EventCard", () => {
	it("labels external events with an External Event chip", () => {
		const event = buildEvent({ accessType: "external" });

		render(<EventCard event={event as never} index={0} />);

		expect(screen.getByText("External Event")).toBeInTheDocument();
	});

	it("labels internal programming with an Internal Event chip", () => {
		const event = buildEvent({
			accessType: "internal",
			internalPath: "/events/dealscale-insider-summit",
		});

		render(<EventCard event={event as never} index={0} />);

		expect(screen.getByText("Internal Event")).toBeInTheDocument();
	});

	it("surfaces the attendance format indicator", () => {
		const event = buildEvent({
			attendanceType: "hybrid",
		});

		render(<EventCard event={event as never} index={0} />);

		expect(screen.getByText("Hybrid")).toBeInTheDocument();
	});
});



