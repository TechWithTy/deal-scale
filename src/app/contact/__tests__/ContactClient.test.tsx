import { render, screen } from "@testing-library/react";
import type React from "react";

const useDataModuleMock = jest.fn();

jest.mock("@/stores/useDataModuleStore", () => ({
	__esModule: true,
	useDataModule: (...args: unknown[]) => useDataModuleMock(...args),
}));

jest.mock("@/components/auth/AuthGuard", () => ({
	__esModule: true,
	default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/components/contact/form/ContactForm", () => ({
	__esModule: true,
	default: () => <div data-testid="contact-form" />,
}));

jest.mock("@/components/contact/form/ContactSteps", () => ({
	__esModule: true,
	ContactSteps: ({ steps }: { steps: unknown[] }) => (
		<div data-testid="contact-steps" data-count={steps.length} />
	),
}));

jest.mock("@/components/contact/schedule/ScheduleMeeting", () => ({
	__esModule: true,
	ScheduleMeeting: () => <div data-testid="schedule-meeting" />,
}));

jest.mock("@/components/contact/newsletter/Newsletter", () => ({
	__esModule: true,
	Newsletter: () => <div data-testid="contact-newsletter" />,
}));

const TrustedByMock = jest.fn(() => <div data-testid="trusted-by" />);

jest.mock("@/components/contact/utils/TrustedByScroller", () => ({
	__esModule: true,
	default: () => TrustedByMock(),
}));

jest.mock("@/components/home/Testimonials", () => ({
	__esModule: true,
	default: ({ testimonials }: { testimonials: unknown[] }) => (
		<div data-testid="testimonials" data-count={testimonials.length} />
	),
}));

jest.mock("next-auth/react", () => ({
	__esModule: true,
	useSession: () => ({ data: null }),
}));

jest.mock("next/navigation", () => ({
	__esModule: true,
	useSearchParams: () => new URLSearchParams(),
}));

describe("ContactClient", () => {
	beforeEach(() => {
		useDataModuleMock.mockReset();
		TrustedByMock.mockClear();
	});

	it("renders loading fallbacks while contact data modules are idle", () => {
		useDataModuleMock.mockImplementation(
			(key: string, selector: (state: unknown) => unknown) => {
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

		const ContactClient = require("../ContactClient").default;

		render(<ContactClient />);

		expect(screen.getByText(/Loading trusted partners/i)).toBeInTheDocument();
		expect(screen.getByText(/Loading testimonials/i)).toBeInTheDocument();
		expect(screen.getByText(/Loading next steps/i)).toBeInTheDocument();
	});
});
