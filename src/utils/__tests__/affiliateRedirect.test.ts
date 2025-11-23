import type { BetaTesterFormValues } from "@/data/contact/formFields";
import type { PriorityPilotFormValues } from "@/data/contact/pilotFormFields";
import { describe, expect, it } from "vitest";
import { buildAffiliateRedirectUrl } from "../affiliateRedirect";

describe("buildAffiliateRedirectUrl", () => {
	it("should build URL with newsletterBeta when newsletterSignup is true (Step 1 only)", () => {
		const formData: BetaTesterFormValues = {
			firstName: "John",
			lastName: "Doe",
			email: "john@example.com",
			phone: "1234567890",
			companyName: "Test Company",
			icpType: "growth_focused_wholesaler",
			employeeCount: "2_5",
			avgDealsClosedPerMonth: "2_3",
			avgDealSize: "50000",
			painPoints: ["time_consuming"],
			wantedFeatures: ["feature1"],
			featureVotes: [],
			urgencyNeed: "I need something ASAP",
			uniqueLeadGeneration: "Test description",
			dealDocuments: [],
			newsletterSignup: true,
			affiliateSignup: true,
			termsAccepted: true,
		};

		const url = buildAffiliateRedirectUrl(formData);
		expect(url).toContain("/affiliate");
		expect(url).toContain("newsletterBeta=true");
		// Should NOT include any Step 2 (payment) fields
		expect(url).not.toContain("bankName");
		expect(url).not.toContain("routingNumber");
		expect(url).not.toContain("accountNumber");
	});

	it("should not include newsletterBeta when newsletterSignup is false", () => {
		const formData: BetaTesterFormValues = {
			firstName: "Jane",
			lastName: "Smith",
			email: "jane@example.com",
			phone: "0987654321",
			companyName: "Another Company",
			icpType: "scaling_real_estate_agent",
			employeeCount: "1",
			avgDealsClosedPerMonth: "0_1",
			avgDealSize: undefined,
			painPoints: [],
			wantedFeatures: [],
			featureVotes: [],
			urgencyNeed: "I'm curious but not ready",
			uniqueLeadGeneration: "Another description",
			dealDocuments: [],
			newsletterSignup: false,
			affiliateSignup: true,
			termsAccepted: true,
		};

		const url = buildAffiliateRedirectUrl(formData);
		expect(url).toContain("/affiliate");
		expect(url).not.toContain("newsletterBeta");
	});

	it("should work with PriorityPilotFormValues", () => {
		const formData: PriorityPilotFormValues = {
			firstName: "Bob",
			lastName: "Johnson",
			email: "bob@example.com",
			phone: "5555555555",
			companyName: "Pilot Company",
			icpType: "systematizing_flipper_investor",
			employeeCount: "6_10",
			avgDealsClosedPerMonth: "4_5",
			avgDealSize: "75000",
			primaryChallenge: ["follow_up"],
			wantedFeatures: ["feature2"],
			featureVotes: [],
			urgencyNeed: "I'm actively exploring",
			uniqueLeadGeneration: "Pilot description",
			dealDocuments: [],
			affiliateSignup: true,
			termsAccepted: true,
		};

		const url = buildAffiliateRedirectUrl(formData);
		expect(url).toContain("/affiliate");
		// PriorityPilotFormValues doesn't have newsletterSignup, so no newsletterBeta param
		expect(url).not.toContain("newsletterBeta");
	});

	it("should not include sensitive fields in URL (Step 1 only, no payment fields)", () => {
		const formData: BetaTesterFormValues = {
			firstName: "Test",
			lastName: "User",
			email: "test@example.com",
			phone: "1234567890",
			companyName: "Test",
			icpType: "growth_focused_wholesaler",
			employeeCount: "1",
			avgDealsClosedPerMonth: "0_1",
			avgDealSize: undefined,
			painPoints: [],
			wantedFeatures: [],
			featureVotes: [],
			urgencyNeed: "Just browsing",
			uniqueLeadGeneration: "Test",
			dealDocuments: [],
			newsletterSignup: true,
			affiliateSignup: true,
			termsAccepted: true,
		};

		const url = buildAffiliateRedirectUrl(formData);
		// Should not include email, phone, name, or other sensitive data
		expect(url).not.toContain("email");
		expect(url).not.toContain("phone");
		expect(url).not.toContain("firstName");
		expect(url).not.toContain("lastName");
		expect(url).not.toContain("test@example.com");
		expect(url).not.toContain("1234567890");
		// Should NOT include any Step 2 (payment/banking) fields
		expect(url).not.toContain("bankName");
		expect(url).not.toContain("routingNumber");
		expect(url).not.toContain("accountNumber");
		expect(url).not.toContain("accountType");
		expect(url).not.toContain("w9");
	});

	it("should return base URL when no prefilled data is available", () => {
		const formData: BetaTesterFormValues = {
			firstName: "Test",
			lastName: "User",
			email: "test@example.com",
			phone: "1234567890",
			companyName: "",
			icpType: "",
			employeeCount: "",
			avgDealsClosedPerMonth: "",
			avgDealSize: undefined,
			painPoints: [],
			wantedFeatures: [],
			featureVotes: [],
			urgencyNeed: "",
			uniqueLeadGeneration: "",
			dealDocuments: [],
			newsletterSignup: false,
			affiliateSignup: false,
			termsAccepted: false,
		};

		const url = buildAffiliateRedirectUrl(formData);
		// Should return base URL without query params when no data to prefill
		expect(url).toBe("/affiliate");
		expect(url).not.toContain("?");
	});
});
