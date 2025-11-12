import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { DynamicFaqSection } from "../DynamicFaqSection";

const mockUseSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
	useSearchParams: () => mockUseSearchParams(),
}));

describe("DynamicFaqSection", () => {
	beforeEach(() => {
		mockUseSearchParams.mockReset();
	});

	it("defaults to investor persona when the query string is empty", () => {
		mockUseSearchParams.mockReturnValue(new URLSearchParams());

		render(<DynamicFaqSection />);

		expect(
			screen.getByTestId("featured-faq-answer"),
		).toHaveTextContent(
			"Investors typically generate $3–$8 in closed-deal revenue for every $1 spent within 90 days—often covering an annual plan with one wholesale or flip deal.",
		);

		expect(screen.getByTestId("persona-next-step")).toHaveTextContent(
			"Drop in your driving-for-dollars or probate leads, enable the \"Motivated Seller Surge\" workflow, and let DealScale run AI voice + SMS follow-up instantly. You’ll get qualified callbacks and hot leads posted to your CRM the same day.",
		);

	expect(screen.getByTestId("persona-advanced-faq")).toHaveTextContent(
		"Clone the winning script, duplicate the campaign, and let DealScale retarget the entire owner cluster. Add AI SMS follow-up to surface referral properties the owner might sell next.",
	);
	});

	it("prefers persona provided via query string", () => {
		mockUseSearchParams.mockReturnValue(
			new URLSearchParams("persona=agency"),
		);

		render(<DynamicFaqSection />);

		expect(
			screen.getByTestId("featured-faq-answer"),
		).toHaveTextContent(
			"DealScale lets marketing and sales agencies deliver AI outreach at scale. You can manage multiple clients, automate campaigns, and provide compliant AI calling, texting, and CRM syncing under your own brand.",
		);

		expect(screen.getByTestId("persona-next-step")).toHaveTextContent(
			"Spin up a client workspace, clone their brand voice, and launch the \"Client Retainer Saver\" campaign. DealScale keeps their pipeline working 24/7 while you report on booked appointments and retained revenue.",
		);

	expect(screen.getByTestId("persona-advanced-faq")).toHaveTextContent(
		"Package DealScale automations into premium retainers. Spin up additional vertical-specific cadences, sync results into their analytics dashboard, and show incremental ROI from AI voice + SMS blends.",
	);
	});

	it("allows users to switch persona via the toggle buttons", () => {
		mockUseSearchParams.mockReturnValue(new URLSearchParams());

		render(<DynamicFaqSection />);

		fireEvent.click(screen.getByRole("button", { name: /enterprise/i }));
		expect(
			screen.getByTestId("featured-faq-answer"),
		).toHaveTextContent(
			"Compliance is built into every layer. DealScale aligns with TCPA, GDPR, CCPA, and Colorado AI Act standards, including AI labeling, audit logs, and opt-out controls.",
		);

		expect(screen.getByTestId("persona-next-step")).toHaveTextContent(
			"Connect your CRM sandbox, provision AI agents for each region, and deploy the \"Enterprise Compliance Guardrail\" sequence. DealScale handles outreach, consent tracking, and audit-ready reporting to keep every team aligned.",
		);

	expect(screen.getByTestId("persona-advanced-faq")).toHaveTextContent(
		"Use DealScale’s workspace hierarchy to group regions, assign AI voices, and enforce compliance templates. Central reporting highlights campaign lift by unit while individual teams manage their own playbooks.",
	);
	});
});

