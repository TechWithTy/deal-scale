import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type React from "react";

type DataModuleSelector<T> = (value: unknown) => T;

const useDataModuleMock = vi.fn();

vi.mock("@/stores/useDataModuleStore", () => ({
	__esModule: true,
	useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

vi.mock("@/components/auth/AuthGuard", () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@/components/contact/form/ContactForm", () => ({
	__esModule: true,
	default: () => <div data-testid="contact-form" />,
}));

vi.mock("@/components/contact/form/ContactSteps", () => ({
	__esModule: true,
	ContactSteps: ({ steps }: { steps: unknown[] }) => (
		<div data-testid="contact-steps" data-count={steps.length} />
	),
}));

vi.mock("@/components/contact/schedule/ScheduleMeeting", () => ({
	__esModule: true,
	ScheduleMeeting: () => <div data-testid="schedule-meeting" />,
}));

vi.mock("@/components/contact/newsletter/Newsletter", () => ({
	__esModule: true,
	Newsletter: () => <div data-testid="contact-newsletter" />,
}));

const TrustedByMock = vi.fn(() => <div data-testid="trusted-by" />);

vi.mock("@/components/contact/utils/TrustedByScroller", () => ({
	__esModule: true,
	default: () => TrustedByMock(),
}));

vi.mock("@/components/home/Testimonials", () => ({
	__esModule: true,
	default: ({ testimonials }: { testimonials: unknown[] }) => (
		<div data-testid="testimonials" data-count={testimonials.length} />
	),
}));

vi.mock("next-auth/react", () => ({
	__esModule: true,
	useSession: () => ({ data: null }),
}));

vi.mock("next/navigation", () => ({
	__esModule: true,
	useSearchParams: () => new URLSearchParams(),
}));

const loadContactClient = async () =>
	(await import("../ContactClient")).default;

describe("ContactClient", () => {
	beforeEach(() => {
		useDataModuleMock.mockReset();
		TrustedByMock.mockClear();
	});

	it("renders loading fallbacks while contact data modules are idle", async () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: DataModuleSelector<unknown>) => {
				switch (key) {
					case "service/slug_data/trustedCompanies":
						return selector({
							status: "idle",
							data: undefined,
							error: undefined,
						});
					case "service/slug_data/testimonials":
						return selector({
							status: "idle",
							data: undefined,
							error: undefined,
						});
					case "service/slug_data/consultationSteps":
						return selector({
							status: "idle",
							data: undefined,
							error: undefined,
						});
					default:
						return selector({
							status: "ready",
							data: undefined,
							error: undefined,
						});
				}
			},
		);

		const ContactClient = await loadContactClient();

		render(<ContactClient />);

		expect(screen.getByText(/Loading trusted partners/i)).toBeInTheDocument();
		expect(screen.getByText(/Loading testimonials/i)).toBeInTheDocument();
		expect(screen.getByText(/Loading next steps/i)).toBeInTheDocument();
	});
});
