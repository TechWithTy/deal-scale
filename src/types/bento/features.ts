import type React from "react";

export interface BentoFeature {
	title: string;
	description?: string;
	icon?: React.ReactNode;
	className?: string;
	content: React.ReactNode;
	background?: React.ReactNode;
}
