import type { LucideIcon } from "lucide-react";

export type NavItemChild = {
	title: string;
	href: string;
	icon: LucideIcon;
};

export type NavItem = {
	title: string;
	href: string;
	children?: NavItemChild[];
};
