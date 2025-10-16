import type { FooterProps } from "@/components/layout/Footer";

export const companyData: FooterProps = {
	companyName: "Deal Scale",
	companyDescription:
		"Deal Scale provides AI-Powered Agents that deliver sales-ready appointments, not just leads. We automate the repetitive, time-consuming work of prospecting and nurturing so real estate investors and wholesalers can focus on what matters most: closing deals. Our mission is to build a consistent, predictable pipeline for every client.",
	socialLinks: {
		linkedin: "https://www.linkedin.com/company/deal-scale/",
		facebook: "https://www.facebook.com/profile.php?id=61576707389189",
		instagram: "https://www.instagram.com/deal_scale/",
		mediumUsername: "dealscale",
	},
	quickLinks: [
		{ href: "/", label: "Home" },
		{ href: "/features", label: "Features" },
		{ href: "/pricing", label: "Pricing" },
		{ href: "/blogs", label: "Blog" },
		{ href: "/about", label: "About Us" },
	],
	contactInfo: {
		email: "sam.scaler@dealscale.io",
		phone: "+1 (720) 258-6576",
		address: "3700 Quebec St\nDenver, CO 80207\nUSA",
	},
	supportLink: "https://dealscale.zohodesk.com/portal/en/home",
	careersLink: "https://dealscale.zohorecruit.com/jobs/Careers",
	privacyPolicyLink: "/privacy",
	termsOfServiceLink: "/tos",
	cookiePolicyLink: "/cookies",
};
