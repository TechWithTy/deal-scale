import { render, screen } from "@testing-library/react";
import { Footer, type FooterProps } from "../Footer";

const baseProps: FooterProps = {
	companyName: "Deal Scale",
	companyLegalName: "Deal Scale LLC",
	companyDescription: "Example description.",
	socialLinks: {
		instagram: "https://instagram.com/deal_scale",
		facebook: "https://facebook.com/dealscale",
		linkedin: "https://linkedin.com/company/deal-scale",
		youtube: "https://youtube.com/@DealScaleRealEstate",
	},
	quickLinks: [
		{ href: "/features", label: "Features" },
		{ href: "/pricing", label: "Pricing" },
	],
	contactInfo: {
		email: "hello@dealscale.io",
		phone: "+1 (720) 258-6576",
		address: "Denver, CO",
	},
	privacyPolicyLink: "/privacy",
	termsOfServiceLink: "/tos",
	cookiePolicyLink: "/cookies",
	supportLink: "/support",
	careersLink: "/careers",
};

describe("Footer social links", () => {
	it("renders the YouTube link when provided", () => {
		render(<Footer {...baseProps} />);

		const youtubeLink = screen.getByRole("link", { name: /youtube/i });

		expect(youtubeLink).toBeInTheDocument();
		expect(youtubeLink).toHaveAttribute(
			"href",
			"https://youtube.com/@DealScaleRealEstate",
		);
	});
});
