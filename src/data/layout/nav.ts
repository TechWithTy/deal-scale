export const offerImg =
	"/sales/offerings/re_investors_guide_financial_freedom.png";
import {
	BookIcon,
	BriefcaseIcon,
	BuildingIcon,
	DollarSignIcon,
	FileTextIcon,
	GlobeIcon,
	HomeIcon,
	InfoIcon,
	LightbulbIcon,
	type LucideIcon,
	NewspaperIcon,
	PhoneIcon,
	RocketIcon,
	UsersIcon,
} from "lucide-react";

import type { StaticImageData } from "next/image";

export type NavItemChild = {
	title: string;
	href: string;
	icon: LucideIcon;
	/**
	 * Optional image URL or import for CTA card
	 */
	image?: string | StaticImageData;
	/**
	 * Optional CTA title for menu card
	 */
	ctaTitle?: string;
	/**
	 * Optional CTA subtitle for menu card
	 */
	ctaSubtitle?: string;
	/**
	 * Optional CTA button config
	 */
	ctaButton?: {
		label: string;
		href: string;
	};
};

export type NavItem = {
	title: string;
	href: string;
	icon?: LucideIcon;
	children?: NavItemChild[];
};

export const navItems: NavItem[] = [
	{ title: "Home", href: "/", icon: HomeIcon },

	{ title: "Features", href: "/features", icon: DollarSignIcon },
	{ title: "Pricing", href: "/pricing", icon: NewspaperIcon },
	{ title: "Marketplace", href: "/products", icon: NewspaperIcon },

	{
		title: "Our Expertise",
		href: "#",
		icon: BookIcon,
		children: [
			{ title: "Blogs", href: "/blogs", icon: HomeIcon },
			{ title: "Case Studies", href: "/case-studies", icon: NewspaperIcon },
			{ title: "About Us", href: "/about", icon: BriefcaseIcon },

			{ title: "Events", href: "/events", icon: HomeIcon },

			{ title: "Partners", href: "/partners", icon: UsersIcon },
			{ title: "Careers", href: "/careers", icon: BriefcaseIcon },
			{
				title: "Tools For Investors & Wholesalers",
				href: "/blogs?tag=investor+wholesaler+tools",
				icon: FileTextIcon,
			},
			{
				title: "Tools For Agents",
				href: "/blogs?tag=agent+tools",
				icon: FileTextIcon,
			},

			{
				title: "Sign Up For Our Newsletter",
				href: "/newsletter",
				icon: FileTextIcon,
				image: offerImg,
				ctaTitle: "RE Launchpad",
				ctaSubtitle: "Get started with AI-powered real estate tools.",
				ctaButton: {
					label: "See Tools",
					href: "/blogs?tag=dev-tools",
				},
			},
		],
	},
	{
		title: "Industries",
		href: "#",
		icon: BuildingIcon,
		children: [
			{
				title: "Investors",
				href: "/industries/investors",
				icon: DollarSignIcon,
			},
			{
				title: "Wholesalers",
				href: "/industries/wholesalers",
				icon: LightbulbIcon,
			},
			{ title: "Agents", href: "/industries/agents", icon: GlobeIcon },
		],
	},

	{ title: "Become A Beta-Tester", href: "/contact", icon: PhoneIcon },
];
