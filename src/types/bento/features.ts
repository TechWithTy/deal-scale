import { LottieComponentProps } from "lottie-react";

export interface BentoFeature {
	title: string;
	description?: string;
	icon?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	content: React.ReactNode;
}
