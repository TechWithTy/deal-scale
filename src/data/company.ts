import type { FooterProps } from "@/components/layout/Footer";

export const companyData: FooterProps = {
	companyName: "Deal Scale",
	companyLegalName: "Deal Scale LLC",
	companyDescription:
		"DealScale is an AI-powered real estate automation and CRM orchestration platform that automates lead generation, skip tracing, and AI-powered follow-up — helping agents, investors, and teams close more deals in less time.",
	socialLinks: {
		linkedin: "https://www.linkedin.com/company/deal-scale/",
		facebook: "https://www.facebook.com/profile.php?id=61576707389189",
		instagram: "https://www.instagram.com/deal_scale/",
		youtube: "https://www.youtube.com/@DealScaleRealEstate",
		twitter: "https://twitter.com/dealscale",
		mediumUsername: "dealscale",
	},
	quickLinks: [
		{ href: "/", label: "Home" },
		{ href: "/features", label: "Features" },
		{ href: "/pricing", label: "Pricing" },
		{ href: "/blogs", label: "Blog" },
		{ href: "/about", label: "About Us" },
		{ href: "/awesome-real-estate-investing", label: "Resources" },
	],
	contactInfo: {
		email: "sam.scaler@leadorchestra.com",
		phone: "+1 (720) 258-6576",
		address: "3700 Quebec St\nDenver, CO 80207\nUSA",
	},
	supportLink: "https://dealscale.zohodesk.com/portal/en/home",
	careersLink: "https://dealscale.zohorecruit.com/jobs/Careers",
	privacyPolicyLink: "/privacy",
	termsOfServiceLink: "/tos",
	cookiePolicyLink: "/cookies",
};
